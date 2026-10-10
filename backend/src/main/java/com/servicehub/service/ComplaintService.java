package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.entity.*;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.exception.UnauthorizedException;
import com.servicehub.repository.BookingRepository;
import com.servicehub.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public ComplaintDTO createComplaint(User complainant, ComplaintCreateDTO dto) {
        Booking booking = null;
        if (dto.getBookingId() != null) {
            booking = bookingRepository.findById(dto.getBookingId()).orElse(null);
        }

        Complaint complaint = new Complaint();
        complaint.setUser(complainant);
        complaint.setBooking(booking);
        complaint.setSubject(dto.getSubject());
        complaint.setDescription(dto.getDescription());
        complaint.setStatus(ComplaintStatus.OPEN);

        complaint = complaintRepository.save(complaint);
        return mapToDTO(complaint);
    }

    public List<ComplaintDTO> getUserComplaints(User user) {
        return complaintRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplaintDTO> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ComplaintDTO resolveComplaint(Long complaintId, ComplaintStatus status, String adminNote) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setStatus(status);
        complaint.setAdminResolutionNote(adminNote);
        if (status == ComplaintStatus.RESOLVED || status == ComplaintStatus.DISMISSED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        complaint = complaintRepository.save(complaint);
        return mapToDTO(complaint);
    }

    private ComplaintDTO mapToDTO(Complaint c) {
        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(c.getId());
        dto.setUserId(c.getUser().getId());
        dto.setUserName(c.getUser().getName());
        dto.setUserEmail(c.getUser().getEmail());
        if (c.getBooking() != null) {
            dto.setBookingId(c.getBooking().getId());
        }
        dto.setSubject(c.getSubject());
        dto.setDescription(c.getDescription());
        dto.setStatus(c.getStatus());
        dto.setAdminResolutionNote(c.getAdminResolutionNote());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }
}
