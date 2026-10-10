package com.servicehub.controller;

import com.servicehub.dto.ServiceDTOs.ProviderProfileDTO;
import com.servicehub.entity.ProviderStatus;
import com.servicehub.security.UserPrincipal;
import com.servicehub.service.ProviderProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderProfileController {

    @Autowired
    private ProviderProfileService providerProfileService;

    @GetMapping
    public ResponseEntity<List<ProviderProfileDTO>> getAllApprovedProviders() {
        return ResponseEntity.ok(providerProfileService.getAllApprovedProviders());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProviderProfileDTO>> getPendingProviders() {
        return ResponseEntity.ok(providerProfileService.getPendingProviders());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderProfileDTO> getMyProviderProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(providerProfileService.getMyProviderProfile(currentUser.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderProfileDTO> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerProfileService.getProviderById(id));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderProfileDTO> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ProviderProfileDTO dto) {
        return ResponseEntity.ok(providerProfileService.updateProfile(currentUser.getUser(), dto));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProviderProfileDTO> updateProviderStatus(
            @PathVariable Long id,
            @RequestParam ProviderStatus status) {
        return ResponseEntity.ok(providerProfileService.updateProviderStatus(id, status));
    }
}
