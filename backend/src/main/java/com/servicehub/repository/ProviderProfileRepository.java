package com.servicehub.repository;

import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.ProviderStatus;
import com.servicehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUser(User user);
    Optional<ProviderProfile> findByUserId(Long userId);
    List<ProviderProfile> findByStatus(ProviderStatus status);
    long countByStatus(ProviderStatus status);
}
