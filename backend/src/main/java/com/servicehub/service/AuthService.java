package com.servicehub.service;

import com.servicehub.dto.AuthDTOs.*;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.ProviderProfileRepository;
import com.servicehub.repository.UserRepository;
import com.servicehub.security.JwtUtils;
import com.servicehub.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Public registration for Admin role is not allowed.");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                request.getAddress(),
                request.getRole()
        );

        user = userRepository.save(user);

        Long providerId = null;
        ProviderStatus providerStatus = null;

        if (request.getRole() == Role.PROVIDER) {
            ProviderProfile profile = new ProviderProfile(
                    user,
                    request.getBusinessName() != null ? request.getBusinessName() : request.getName() + " Services",
                    request.getBio(),
                    request.getExperienceYears() != null ? request.getExperienceYears() : 1,
                    request.getCity() != null ? request.getCity() : request.getAddress()
            );
            profile = providerProfileRepository.save(profile);
            providerId = profile.getId();
            providerStatus = profile.getStatus();
        }

        UserPrincipal userPrincipal = new UserPrincipal(user);
        String token = jwtUtils.generateToken(userPrincipal);

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), providerId, providerStatus);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userPrincipal.getUser();

        if (!user.isEnabled()) {
            throw new BadRequestException("Account has been disabled by Administrator.");
        }

        String token = jwtUtils.generateToken(userPrincipal);

        Long providerId = null;
        ProviderStatus providerStatus = null;

        if (user.getRole() == Role.PROVIDER) {
            ProviderProfile profile = providerProfileRepository.findByUser(user).orElse(null);
            if (profile != null) {
                providerId = profile.getId();
                providerStatus = profile.getStatus();
            }
        }

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), providerId, providerStatus);
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long providerId = null;
        ProviderStatus providerStatus = null;

        if (user.getRole() == Role.PROVIDER) {
            ProviderProfile profile = providerProfileRepository.findByUser(user).orElse(null);
            if (profile != null) {
                providerId = profile.getId();
                providerStatus = profile.getStatus();
            }
        }

        return new AuthResponse(null, user.getId(), user.getName(), user.getEmail(), user.getRole(), providerId, providerStatus);
    }
}
