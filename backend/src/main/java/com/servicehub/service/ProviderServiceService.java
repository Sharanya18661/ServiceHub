package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.ProviderServiceDTO;
import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.ProviderService;
import com.servicehub.entity.ServiceCategory;
import com.servicehub.entity.User;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.exception.UnauthorizedException;
import com.servicehub.repository.ProviderProfileRepository;
import com.servicehub.repository.ProviderServiceRepository;
import com.servicehub.repository.ServiceCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProviderServiceService {

    @Autowired
    private ProviderServiceRepository providerServiceRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    public List<ProviderServiceDTO> searchServices(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String search) {
        return providerServiceRepository.searchServices(categoryId, minPrice, maxPrice, search).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProviderServiceDTO> getServicesByProviderId(Long providerId) {
        return providerServiceRepository.findByProviderId(providerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProviderServiceDTO createService(User user, ProviderServiceDTO dto) {
        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("User does not have a provider profile"));

        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        ProviderService service = new ProviderService(
                profile,
                category,
                dto.getTitle(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getPriceType() != null ? dto.getPriceType() : "Fixed"
        );

        service = providerServiceRepository.save(service);
        return mapToDTO(service);
    }

    public ProviderServiceDTO updateService(User user, Long serviceId, ProviderServiceDTO dto) {
        ProviderService service = providerServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found"));

        if (!service.getProvider().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not authorized to update this service");
        }

        if (dto.getCategoryId() != null) {
            ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            service.setCategory(category);
        }

        service.setTitle(dto.getTitle());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        if (dto.getPriceType() != null) service.setPriceType(dto.getPriceType());
        service.setActive(dto.isActive());

        service = providerServiceRepository.save(service);
        return mapToDTO(service);
    }

    public void deleteService(User user, Long serviceId) {
        ProviderService service = providerServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found"));

        if (!service.getProvider().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not authorized to delete this service");
        }

        providerServiceRepository.delete(service);
    }

    private ProviderServiceDTO mapToDTO(ProviderService ps) {
        ProviderServiceDTO dto = new ProviderServiceDTO();
        dto.setId(ps.getId());
        dto.setCategoryId(ps.getCategory().getId());
        dto.setCategoryName(ps.getCategory().getName());
        dto.setTitle(ps.getTitle());
        dto.setDescription(ps.getDescription());
        dto.setPrice(ps.getPrice());
        dto.setPriceType(ps.getPriceType());
        dto.setActive(ps.isActive());
        dto.setProviderId(ps.getProvider().getId());
        dto.setBusinessName(ps.getProvider().getBusinessName());
        return dto;
    }
}
