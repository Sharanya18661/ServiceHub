package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.BookingDTO;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.exception.UnauthorizedException;
import com.servicehub.repository.BookingRepository;
import com.servicehub.repository.ProviderProfileRepository;
import com.servicehub.repository.ReviewRepository;
import com.servicehub.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<BookingDTO> getCustomerBookings(User customer) {
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getProviderBookings(User providerUser) {
        ProviderProfile provider = providerProfileRepository.findByUser(providerUser)
                .orElseThrow(() -> new BadRequestException("User is not a registered provider"));
        return bookingRepository.findByProviderOrderByCreatedAtDesc(provider).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToDTO(booking);
    }

    @Transactional
    public BookingDTO updateBookingStatus(User user, Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isProvider = booking.getProvider().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCustomer && !isProvider && !isAdmin) {
            throw new UnauthorizedException("Not authorized to update this booking");
        }

        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.COMPLETED) {
            booking.setCompletedAt(LocalDateTime.now());
            ServiceRequest request = booking.getServiceRequest();
            request.setStatus(RequestStatus.COMPLETED);
            serviceRequestRepository.save(request);
        } else if (newStatus == BookingStatus.CANCELLED) {
            ServiceRequest request = booking.getServiceRequest();
            request.setStatus(RequestStatus.CANCELLED);
            serviceRequestRepository.save(request);
        }

        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }

    public BookingDTO mapToDTO(Booking b) {
        BookingDTO dto = new BookingDTO();
        dto.setId(b.getId());
        dto.setServiceRequestId(b.getServiceRequest().getId());
        dto.setRequestTitle(b.getServiceRequest().getTitle());
        dto.setQuotationId(b.getQuotation().getId());
        dto.setCustomerId(b.getCustomer().getId());
        dto.setCustomerName(b.getCustomer().getName());
        dto.setCustomerPhone(b.getCustomer().getPhone());
        dto.setCustomerAddress(b.getServiceRequest().getAddress());
        dto.setProviderId(b.getProvider().getId());
        dto.setProviderBusinessName(b.getProvider().getBusinessName());
        dto.setProviderPhone(b.getProvider().getUser().getPhone());
        dto.setFinalPrice(b.getFinalPrice());
        dto.setStatus(b.getStatus());
        dto.setScheduledDate(b.getScheduledDate());
        dto.setNotes(b.getNotes());
        dto.setCreatedAt(b.getCreatedAt());
        dto.setCompletedAt(b.getCompletedAt());
        dto.setReviewed(reviewRepository.existsByBookingId(b.getId()));
        return dto;
    }
}
