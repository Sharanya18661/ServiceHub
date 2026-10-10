package com.servicehub.repository;

import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.ProviderService;
import com.servicehub.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    List<ProviderService> findByProvider(ProviderProfile provider);
    List<ProviderService> findByProviderId(Long providerId);
    List<ProviderService> findByCategory(ServiceCategory category);
    List<ProviderService> findByActiveTrue();

    @Query("SELECT ps FROM ProviderService ps WHERE ps.active = true " +
           "AND (:categoryId IS NULL OR ps.category.id = :categoryId) " +
           "AND (:minPrice IS NULL OR ps.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR ps.price <= :maxPrice) " +
           "AND (:search IS NULL OR LOWER(ps.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(ps.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(ps.provider.businessName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<ProviderService> searchServices(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search);
}
