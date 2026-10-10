package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.ProviderProfileDTO;
import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.ProviderStatus;
import com.servicehub.entity.User;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.ProviderProfileRepository;
import com.servicehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProviderProfileService {

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProviderProfileDTO> getAllApprovedProviders() {
        return providerProfileRepository.findByStatus(ProviderStatus.APPROVED).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProviderProfileDTO> getPendingProviders() {
        return providerProfileRepository.findByStatus(ProviderStatus.PENDING).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProviderProfileDTO getProviderById(Long id) {
        ProviderProfile profile = providerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found with ID: " + id));
        return mapToDTO(profile);
    }

    public ProviderProfileDTO getMyProviderProfile(User user) {
        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for user"));
        return mapToDTO(profile);
    }

    public ProviderProfileDTO updateProfile(User user, ProviderProfileDTO dto) {
        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("User does not have a provider profile"));

        profile.setBusinessName(dto.getBusinessName());
        profile.setBio(dto.getBio());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setCity(dto.getCity());

        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
            userRepository.save(user);
        }

        profile = providerProfileRepository.save(profile);
        return mapToDTO(profile);
    }

    public ProviderProfileDTO updateProviderStatus(Long providerId, ProviderStatus status) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        profile.setStatus(status);
        profile = providerProfileRepository.save(profile);
        return mapToDTO(profile);
    }

    private ProviderProfileDTO mapToDTO(ProviderProfile p) {
        ProviderProfileDTO dto = new ProviderProfileDTO();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setName(p.getUser().getName());
        dto.setEmail(p.getUser().getEmail());
        dto.setPhone(p.getUser().getPhone());
        dto.setBusinessName(p.getBusinessName());
        dto.setBio(p.getBio());
        dto.setExperienceYears(p.getExperienceYears());
        dto.setCity(p.getCity());
        dto.setStatus(p.getStatus());
        dto.setRating(p.getRating());
        dto.setTotalReviews(p.getTotalReviews());
        return dto;
    }
}
