package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.exception.UnauthorizedException;
import com.servicehub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuotationService {

    @Autowired
    private QuotationRepository quotationRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public QuotationDTO createQuotation(User providerUser, QuotationCreateDTO dto) {
        ProviderProfile provider = providerProfileRepository.findByUser(providerUser)
                .orElseThrow(() -> new BadRequestException("User is not a registered provider"));

        if (provider.getStatus() != ProviderStatus.APPROVED) {
            throw new BadRequestException("Your provider profile must be approved by Admin before submitting quotations");
        }

        ServiceRequest request = serviceRequestRepository.findById(dto.getServiceRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found"));

        if (request.getStatus() == RequestStatus.ACCEPTED || request.getStatus() == RequestStatus.COMPLETED || request.getStatus() == RequestStatus.CANCELLED) {
            throw new BadRequestException("Cannot quote on a request that is " + request.getStatus());
        }

        Quotation quotation = quotationRepository.findByServiceRequestAndProvider(request, provider)
                .orElse(new Quotation());

        quotation.setServiceRequest(request);
        quotation.setProvider(provider);
        quotation.setEstimatedPrice(dto.getEstimatedPrice());
        quotation.setMessage(dto.getMessage());
        quotation.setValidUntil(dto.getValidUntil() != null ? dto.getValidUntil() : request.getPreferredDate());
        quotation.setStatus(QuotationStatus.PENDING);

        quotation = quotationRepository.save(quotation);

        request.setStatus(RequestStatus.QUOTATION_SENT);
        serviceRequestRepository.save(request);

        return mapToDTO(quotation);
    }

    public List<QuotationDTO> getQuotationsForRequest(Long requestId) {
        return quotationRepository.findByServiceRequestId(requestId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<QuotationDTO> getProviderQuotations(User providerUser) {
        ProviderProfile provider = providerProfileRepository.findByUser(providerUser)
                .orElseThrow(() -> new BadRequestException("User is not a registered provider"));
        return quotationRepository.findByProviderOrderByCreatedAtDesc(provider).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDTO acceptQuotation(User customer, Long quotationId) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found"));

        ServiceRequest request = quotation.getServiceRequest();

        if (!request.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You are not authorized to accept this quotation");
        }

        if (quotation.getStatus() != QuotationStatus.PENDING) {
            throw new BadRequestException("Quotation is not pending");
        }

        quotation.setStatus(QuotationStatus.ACCEPTED);
        quotationRepository.save(quotation);

        request.setStatus(RequestStatus.ACCEPTED);
        serviceRequestRepository.save(request);

        // Reject other quotations for this request
        List<Quotation> otherQuotes = quotationRepository.findByServiceRequest(request);
        for (Quotation q : otherQuotes) {
            if (!q.getId().equals(quotation.getId()) && q.getStatus() == QuotationStatus.PENDING) {
                q.setStatus(QuotationStatus.REJECTED);
                quotationRepository.save(q);
            }
        }

        // Create Booking
        Booking booking = new Booking();
        booking.setServiceRequest(request);
        booking.setQuotation(quotation);
        booking.setCustomer(customer);
        booking.setProvider(quotation.getProvider());
        booking.setFinalPrice(quotation.getEstimatedPrice());
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setScheduledDate(request.getPreferredDate());
        booking.setNotes("Accepted Quote from " + quotation.getProvider().getBusinessName());

        booking = bookingRepository.save(booking);

        return mapBookingToDTO(booking);
    }

    @Transactional
    public QuotationDTO rejectQuotation(User customer, Long quotationId) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found"));

        ServiceRequest request = quotation.getServiceRequest();

        if (!request.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You are not authorized to reject this quotation");
        }

        quotation.setStatus(QuotationStatus.REJECTED);
        quotation = quotationRepository.save(quotation);

        return mapToDTO(quotation);
    }

    private QuotationDTO mapToDTO(Quotation q) {
        QuotationDTO dto = new QuotationDTO();
        dto.setId(q.getId());
        dto.setServiceRequestId(q.getServiceRequest().getId());
        dto.setRequestTitle(q.getServiceRequest().getTitle());
        dto.setProviderId(q.getProvider().getId());
        dto.setProviderBusinessName(q.getProvider().getBusinessName());
        dto.setProviderPhone(q.getProvider().getUser().getPhone());
        dto.setProviderRating(q.getProvider().getRating());
        dto.setEstimatedPrice(q.getEstimatedPrice());
        dto.setMessage(q.getMessage());
        dto.setValidUntil(q.getValidUntil());
        dto.setStatus(q.getStatus());
        dto.setCreatedAt(q.getCreatedAt());
        return dto;
    }

    private BookingDTO mapBookingToDTO(Booking b) {
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
        return dto;
    }
}
