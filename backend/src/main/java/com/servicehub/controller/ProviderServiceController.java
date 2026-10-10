package com.servicehub.controller;

import com.servicehub.dto.ServiceDTOs.ProviderServiceDTO;
import com.servicehub.security.UserPrincipal;
import com.servicehub.service.ProviderServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ProviderServiceController {

    @Autowired
    private ProviderServiceService providerServiceService;

    @GetMapping
    public ResponseEntity<List<ProviderServiceDTO>> searchServices(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(providerServiceService.searchServices(categoryId, minPrice, maxPrice, search));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderServiceDTO>> getServicesByProviderId(@PathVariable Long providerId) {
        return ResponseEntity.ok(providerServiceService.getServicesByProviderId(providerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderServiceDTO> createService(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ProviderServiceDTO dto) {
        return ResponseEntity.ok(providerServiceService.createService(currentUser.getUser(), dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderServiceDTO> updateService(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ProviderServiceDTO dto) {
        return ResponseEntity.ok(providerServiceService.updateService(currentUser.getUser(), id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> deleteService(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        providerServiceService.deleteService(currentUser.getUser(), id);
        return ResponseEntity.noContent().build();
    }
}
