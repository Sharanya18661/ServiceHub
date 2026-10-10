package com.servicehub.controller;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.security.UserPrincipal;
import com.servicehub.service.QuotationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<QuotationDTO> createQuotation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody QuotationCreateDTO dto) {
        return ResponseEntity.ok(quotationService.createQuotation(currentUser.getUser(), dto));
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<QuotationDTO>> getQuotationsForRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(quotationService.getQuotationsForRequest(requestId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<QuotationDTO>> getMyQuotations(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(quotationService.getProviderQuotations(currentUser.getUser()));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingDTO> acceptQuotation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(quotationService.acceptQuotation(currentUser.getUser(), id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<QuotationDTO> rejectQuotation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(quotationService.rejectQuotation(currentUser.getUser(), id));
    }
}
