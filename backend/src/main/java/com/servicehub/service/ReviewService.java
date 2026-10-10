package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.exception.UnauthorizedException;
import com.servicehub.repository.BookingRepository;
import com.servicehub.repository.ProviderProfileRepository;
import com.servicehub.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Transactional
    public ReviewDTO createReview(User customer, ReviewCreateDTO dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You are not authorized to review this booking");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Can only review completed bookings");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("Review already submitted for this booking");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setCustomer(customer);
        review.setProvider(booking.getProvider());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        review = reviewRepository.save(review);

        // Update Provider rating and review count
        ProviderProfile provider = booking.getProvider();
        Double avgRating = reviewRepository.getAverageRatingForProvider(provider.getId());
        Long totalReviews = reviewRepository.countReviewsForProvider(provider.getId());

        provider.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        provider.setTotalReviews(totalReviews != null ? totalReviews.intValue() : 0);
        providerProfileRepository.save(provider);

        return mapToDTO(review);
    }

    public List<ReviewDTO> getReviewsForProvider(Long providerId) {
        ProviderProfile provider = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        return reviewRepository.findByProviderOrderByCreatedAtDesc(provider).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO mapToDTO(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        dto.setBookingId(r.getBooking().getId());
        dto.setCustomerId(r.getCustomer().getId());
        dto.setCustomerName(r.getCustomer().getName());
        dto.setProviderId(r.getProvider().getId());
        dto.setProviderBusinessName(r.getProvider().getBusinessName());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
