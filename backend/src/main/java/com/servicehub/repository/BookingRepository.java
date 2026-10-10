package com.servicehub.repository;

import com.servicehub.entity.Booking;
import com.servicehub.entity.BookingStatus;
import com.servicehub.entity.ProviderProfile;
import com.servicehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Booking> findByProviderOrderByCreatedAtDesc(ProviderProfile provider);
    List<Booking> findByStatus(BookingStatus status);
}
