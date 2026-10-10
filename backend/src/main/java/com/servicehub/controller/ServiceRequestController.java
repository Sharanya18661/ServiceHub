package com.servicehub.controller;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.security.UserPrincipal;
import com.servicehub.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ServiceRequestDTO> createRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ServiceRequestCreateDTO dto) {
        return ResponseEntity.ok(serviceRequestService.createRequest(currentUser.getUser(), dto));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ServiceRequestDTO>> getMyRequests(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(serviceRequestService.getCustomerRequests(currentUser.getUser()));
    }

    @GetMapping("/incoming")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<ServiceRequestDTO>> getIncomingRequests(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(serviceRequestService.getIncomingRequestsForProvider(currentUser.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestDTO> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getRequestById(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequestDTO> cancelRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.cancelRequest(currentUser.getUser(), id));
    }
}
