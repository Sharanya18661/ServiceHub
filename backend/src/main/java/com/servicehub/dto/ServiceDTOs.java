package com.servicehub.dto;

import com.servicehub.entity.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ServiceDTOs {

    public static class CategoryDTO {
        private Long id;
        @NotBlank(message = "Category name is required")
        private String name;
        private String description;
        private String icon;
        private String imageUrl;

        public CategoryDTO() {}

        public CategoryDTO(Long id, String name, String description, String icon, String imageUrl) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.icon = icon;
            this.imageUrl = imageUrl;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    public static class ProviderServiceDTO {
        private Long id;
        @NotNull(message = "Category ID is required")
        private Long categoryId;
        private String categoryName;
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        private BigDecimal price;
        private String priceType;
        private boolean active = true;
        private Long providerId;
        private String businessName;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public String getPriceType() { return priceType; }
        public void setPriceType(String priceType) { this.priceType = priceType; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
    }

    public static class ServiceRequestCreateDTO {
        @NotNull(message = "Category ID is required")
        private Long categoryId;
        private Long targetProviderId;
        @NotBlank(message = "Title is required")
        private String title;
        @NotBlank(message = "Description is required")
        private String description;
        @NotBlank(message = "Address is required")
        private String address;
        @NotNull(message = "Preferred date is required")
        private LocalDate preferredDate;
        private String preferredTime;

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public Long getTargetProviderId() { return targetProviderId; }
        public void setTargetProviderId(Long targetProviderId) { this.targetProviderId = targetProviderId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public LocalDate getPreferredDate() { return preferredDate; }
        public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }
        public String getPreferredTime() { return preferredTime; }
        public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }
    }

    public static class ServiceRequestDTO {
        private Long id;
        private Long customerId;
        private String customerName;
        private String customerPhone;
        private String customerEmail;
        private Long categoryId;
        private String categoryName;
        private Long targetProviderId;
        private String targetProviderName;
        private String title;
        private String description;
        private String address;
        private LocalDate preferredDate;
        private String preferredTime;
        private RequestStatus status;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public Long getTargetProviderId() { return targetProviderId; }
        public void setTargetProviderId(Long targetProviderId) { this.targetProviderId = targetProviderId; }
        public String getTargetProviderName() { return targetProviderName; }
        public void setTargetProviderName(String targetProviderName) { this.targetProviderName = targetProviderName; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public LocalDate getPreferredDate() { return preferredDate; }
        public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }
        public String getPreferredTime() { return preferredTime; }
        public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }
        public RequestStatus getStatus() { return status; }
        public void setStatus(RequestStatus status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class QuotationCreateDTO {
        @NotNull(message = "Service Request ID is required")
        private Long serviceRequestId;
        @NotNull(message = "Estimated price is required")
        @Positive(message = "Estimated price must be positive")
        private BigDecimal estimatedPrice;
        private String message;
        private LocalDate validUntil;

        public Long getServiceRequestId() { return serviceRequestId; }
        public void setServiceRequestId(Long serviceRequestId) { this.serviceRequestId = serviceRequestId; }
        public BigDecimal getEstimatedPrice() { return estimatedPrice; }
        public void setEstimatedPrice(BigDecimal estimatedPrice) { this.estimatedPrice = estimatedPrice; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public LocalDate getValidUntil() { return validUntil; }
        public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }
    }

    public static class QuotationDTO {
        private Long id;
        private Long serviceRequestId;
        private String requestTitle;
        private Long providerId;
        private String providerBusinessName;
        private String providerPhone;
        private Double providerRating;
        private BigDecimal estimatedPrice;
        private String message;
        private LocalDate validUntil;
        private QuotationStatus status;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getServiceRequestId() { return serviceRequestId; }
        public void setServiceRequestId(Long serviceRequestId) { this.serviceRequestId = serviceRequestId; }
        public String getRequestTitle() { return requestTitle; }
        public void setRequestTitle(String requestTitle) { this.requestTitle = requestTitle; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getProviderBusinessName() { return providerBusinessName; }
        public void setProviderBusinessName(String providerBusinessName) { this.providerBusinessName = providerBusinessName; }
        public String getProviderPhone() { return providerPhone; }
        public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
        public Double getProviderRating() { return providerRating; }
        public void setProviderRating(Double providerRating) { this.providerRating = providerRating; }
        public BigDecimal getEstimatedPrice() { return estimatedPrice; }
        public void setEstimatedPrice(BigDecimal estimatedPrice) { this.estimatedPrice = estimatedPrice; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public LocalDate getValidUntil() { return validUntil; }
        public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }
        public QuotationStatus getStatus() { return status; }
        public void setStatus(QuotationStatus status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class BookingDTO {
        private Long id;
        private Long serviceRequestId;
        private String requestTitle;
        private Long quotationId;
        private Long customerId;
        private String customerName;
        private String customerPhone;
        private String customerAddress;
        private Long providerId;
        private String providerBusinessName;
        private String providerPhone;
        private BigDecimal finalPrice;
        private BookingStatus status;
        private LocalDate scheduledDate;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime completedAt;
        private boolean reviewed;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getServiceRequestId() { return serviceRequestId; }
        public void setServiceRequestId(Long serviceRequestId) { this.serviceRequestId = serviceRequestId; }
        public String getRequestTitle() { return requestTitle; }
        public void setRequestTitle(String requestTitle) { this.requestTitle = requestTitle; }
        public Long getQuotationId() { return quotationId; }
        public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
        public String getCustomerAddress() { return customerAddress; }
        public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getProviderBusinessName() { return providerBusinessName; }
        public void setProviderBusinessName(String providerBusinessName) { this.providerBusinessName = providerBusinessName; }
        public String getProviderPhone() { return providerPhone; }
        public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
        public BigDecimal getFinalPrice() { return finalPrice; }
        public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }
        public BookingStatus getStatus() { return status; }
        public void setStatus(BookingStatus status) { this.status = status; }
        public LocalDate getScheduledDate() { return scheduledDate; }
        public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getCompletedAt() { return completedAt; }
        public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
        public boolean isReviewed() { return reviewed; }
        public void setReviewed(boolean reviewed) { this.reviewed = reviewed; }
    }

    public static class ReviewCreateDTO {
        @NotNull(message = "Booking ID is required")
        private Long bookingId;
        @NotNull(message = "Rating is required")
        private Integer rating; // 1-5
        private String comment;

        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class ReviewDTO {
        private Long id;
        private Long bookingId;
        private Long customerId;
        private String customerName;
        private Long providerId;
        private String providerBusinessName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getProviderBusinessName() { return providerBusinessName; }
        public void setProviderBusinessName(String providerBusinessName) { this.providerBusinessName = providerBusinessName; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class ComplaintCreateDTO {
        private Long bookingId;
        @NotBlank(message = "Subject is required")
        private String subject;
        @NotBlank(message = "Description is required")
        private String description;

        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class ComplaintDTO {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Long bookingId;
        private String subject;
        private String description;
        private ComplaintStatus status;
        private String adminResolutionNote;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public ComplaintStatus getStatus() { return status; }
        public void setStatus(ComplaintStatus status) { this.status = status; }
        public String getAdminResolutionNote() { return adminResolutionNote; }
        public void setAdminResolutionNote(String adminResolutionNote) { this.adminResolutionNote = adminResolutionNote; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getResolvedAt() { return resolvedAt; }
        public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    }

    public static class ProviderProfileDTO {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String businessName;
        private String bio;
        private Integer experienceYears;
        private String city;
        private ProviderStatus status;
        private Double rating;
        private Integer totalReviews;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public Integer getExperienceYears() { return experienceYears; }
        public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public ProviderStatus getStatus() { return status; }
        public void setStatus(ProviderStatus status) { this.status = status; }
        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }
        public Integer getTotalReviews() { return totalReviews; }
        public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    }

    public static class AdminDashboardStats {
        private long totalCustomers;
        private long totalProviders;
        private long pendingProviders;
        private long totalServiceRequests;
        private long totalBookings;
        private long openComplaints;

        public AdminDashboardStats() {}

        public AdminDashboardStats(long totalCustomers, long totalProviders, long pendingProviders, long totalServiceRequests, long totalBookings, long openComplaints) {
            this.totalCustomers = totalCustomers;
            this.totalProviders = totalProviders;
            this.pendingProviders = pendingProviders;
            this.totalServiceRequests = totalServiceRequests;
            this.totalBookings = totalBookings;
            this.openComplaints = openComplaints;
        }

        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
        public long getTotalProviders() { return totalProviders; }
        public void setTotalProviders(long totalProviders) { this.totalProviders = totalProviders; }
        public long getPendingProviders() { return pendingProviders; }
        public void setPendingProviders(long pendingProviders) { this.pendingProviders = pendingProviders; }
        public long getTotalServiceRequests() { return totalServiceRequests; }
        public void setTotalServiceRequests(long totalServiceRequests) { this.totalServiceRequests = totalServiceRequests; }
        public long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
        public long getOpenComplaints() { return openComplaints; }
        public void setOpenComplaints(long openComplaints) { this.openComplaints = openComplaints; }
    }
}
