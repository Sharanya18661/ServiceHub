package com.servicehub.repository;

import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.RequestStatus;
import com.servicehub.entity.ServiceRequest;
import com.servicehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByCustomerOrderByCreatedAtDesc(User customer);
    List<ServiceRequest> findByTargetProviderOrderByCreatedAtDesc(ProviderProfile targetProvider);
    
    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.targetProvider IS NULL OR sr.targetProvider.id = :providerId ORDER BY sr.createdAt DESC")
    List<ServiceRequest> findAvailableRequestsForProvider(@Param("providerId") Long providerId);
    
    List<ServiceRequest> findByStatus(RequestStatus status);
}
