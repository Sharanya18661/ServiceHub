package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.exception.UnauthorizedException;
import com.servicehub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    public ServiceRequestDTO createRequest(User customer, ServiceRequestCreateDTO dto) {
        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        ProviderProfile targetProvider = null;
        if (dto.getTargetProviderId() != null) {
            targetProvider = providerProfileRepository.findById(dto.getTargetProviderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target provider not found"));
        }

        ServiceRequest request = new ServiceRequest();
        request.setCustomer(customer);
        request.setCategory(category);
        request.setTargetProvider(targetProvider);
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setAddress(dto.getAddress() != null ? dto.getAddress() : customer.getAddress());
        request.setPreferredDate(dto.getPreferredDate());
        request.setPreferredTime(dto.getPreferredTime() != null ? dto.getPreferredTime() : "Morning");
        request.setStatus(RequestStatus.REQUESTED);

        request = serviceRequestRepository.save(request);
        return mapToDTO(request);
    }

    public List<ServiceRequestDTO> getCustomerRequests(User customer) {
        return serviceRequestRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ServiceRequestDTO> getIncomingRequestsForProvider(User providerUser) {
        ProviderProfile profile = providerProfileRepository.findByUser(providerUser)
                .orElseThrow(() -> new BadRequestException("User is not a registered provider"));

        return serviceRequestRepository.findAvailableRequestsForProvider(profile.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ServiceRequestDTO getRequestById(Long id) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found"));
        return mapToDTO(request);
    }

    public ServiceRequestDTO cancelRequest(User user, Long requestId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found"));

        if (!request.getCustomer().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Not authorized to cancel this request");
        }

        if (request.getStatus() == RequestStatus.COMPLETED || request.getStatus() == RequestStatus.ACCEPTED) {
            throw new BadRequestException("Cannot cancel a request that is already accepted or completed");
        }

        request.setStatus(RequestStatus.CANCELLED);
        request = serviceRequestRepository.save(request);
        return mapToDTO(request);
    }

    public ServiceRequestDTO mapToDTO(ServiceRequest req) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(req.getId());
        dto.setCustomerId(req.getCustomer().getId());
        dto.setCustomerName(req.getCustomer().getName());
        dto.setCustomerPhone(req.getCustomer().getPhone());
        dto.setCustomerEmail(req.getCustomer().getEmail());
        dto.setCategoryId(req.getCategory().getId());
        dto.setCategoryName(req.getCategory().getName());
        if (req.getTargetProvider() != null) {
            dto.setTargetProviderId(req.getTargetProvider().getId());
            dto.setTargetProviderName(req.getTargetProvider().getBusinessName());
        }
        dto.setTitle(req.getTitle());
        dto.setDescription(req.getDescription());
        dto.setAddress(req.getAddress());
        dto.setPreferredDate(req.getPreferredDate());
        dto.setPreferredTime(req.getPreferredTime());
        dto.setStatus(req.getStatus());
        dto.setCreatedAt(req.getCreatedAt());
        return dto;
    }
}
