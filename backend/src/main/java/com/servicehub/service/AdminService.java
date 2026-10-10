package com.servicehub.service;

import com.servicehub.dto.AuthDTOs.UserResponse;
import com.servicehub.dto.ServiceDTOs.AdminDashboardStats;
import com.servicehub.entity.ComplaintStatus;
import com.servicehub.entity.ProviderStatus;
import com.servicehub.entity.Role;
import com.servicehub.entity.User;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public AdminDashboardStats getDashboardStats() {
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalProviders = userRepository.countByRole(Role.PROVIDER);
        long pendingProviders = providerProfileRepository.countByStatus(ProviderStatus.PENDING);
        long totalServiceRequests = serviceRequestRepository.count();
        long totalBookings = bookingRepository.count();
        long openComplaints = complaintRepository.countByStatus(ComplaintStatus.OPEN);

        return new AdminDashboardStats(totalCustomers, totalProviders, pendingProviders, totalServiceRequests, totalBookings, openComplaints);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    UserResponse resp = new UserResponse();
                    resp.setId(user.getId());
                    resp.setName(user.getName());
                    resp.setEmail(user.getEmail());
                    resp.setPhone(user.getPhone());
                    resp.setAddress(user.getAddress());
                    resp.setRole(user.getRole());
                    resp.setEnabled(user.isEnabled());
                    return resp;
                })
                .collect(Collectors.toList());
    }

    public UserResponse toggleUserEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEnabled(!user.isEnabled());
        user = userRepository.save(user);

        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setAddress(user.getAddress());
        resp.setRole(user.getRole());
        resp.setEnabled(user.isEnabled());
        return resp;
    }
}
