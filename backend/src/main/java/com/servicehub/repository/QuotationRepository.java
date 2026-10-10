package com.servicehub.repository;

import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.Quotation;
import com.servicehub.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByServiceRequest(ServiceRequest serviceRequest);
    List<Quotation> findByServiceRequestId(Long serviceRequestId);
    List<Quotation> findByProviderOrderByCreatedAtDesc(ProviderProfile provider);
    Optional<Quotation> findByServiceRequestAndProvider(ServiceRequest serviceRequest, ProviderProfile provider);
}
