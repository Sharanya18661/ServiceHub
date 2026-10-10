package com.servicehub.controller;

import com.servicehub.dto.ServiceDTOs.*;
import com.servicehub.security.UserPrincipal;
import com.servicehub.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewDTO> createReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewCreateDTO dto) {
        return ResponseEntity.ok(reviewService.createReview(currentUser.getUser(), dto));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsForProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getReviewsForProvider(providerId));
    }
}
