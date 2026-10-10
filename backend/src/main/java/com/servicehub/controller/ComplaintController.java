package com.servicehub.controller;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.entity.ComplaintStatus;
import com.servicehub.security.UserPrincipal;
import com.servicehub.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintDTO> createComplaint(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ComplaintCreateDTO dto) {
        return ResponseEntity.ok(complaintService.createComplaint(currentUser.getUser(), dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintDTO>> getMyComplaints(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(complaintService.getUserComplaints(currentUser.getUser()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintDTO> resolveComplaint(
            @PathVariable Long id,
            @RequestParam ComplaintStatus status,
            @RequestParam(required = false, defaultValue = "Resolved by administrator.") String adminNote) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, status, adminNote));
    }
}
