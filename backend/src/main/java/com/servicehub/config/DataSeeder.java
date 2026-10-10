package com.servicehub.config;

import com.servicehub.entity.*;
import com.servicehub.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${servicehub.admin.name:System Administrator}")
    private String adminName;

    @Value("${servicehub.admin.email:admin@servicehub.com}")
    private String adminEmail;

    @Value("${servicehub.admin.password:Admin@12345}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository,
                      ProviderProfileRepository providerProfileRepository,
                      ServiceCategoryRepository categoryRepository,
                      ProviderServiceRepository providerServiceRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.categoryRepository = categoryRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAdminUser();
        seedCategories();
        seedSampleDataIfEmpty();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                    adminName,
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    "+1-800-555-0199",
                    "ServiceHub Admin HQ, City Center",
                    Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println(">>> Initialized default Admin user: " + adminEmail);
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<ServiceCategory> categories = Arrays.asList(
                    new ServiceCategory("Plumbing & Pipefitting", "Expert leak repair, pipe fitting, faucet installation, and drain unblocking services.", "Wrench", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"),
                    new ServiceCategory("Electrical & Lighting", "Professional wiring, circuit breaker maintenance, light fixture setup, and safety audits.", "Zap", "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"),
                    new ServiceCategory("Home Cleaning & Hygiene", "Deep house cleaning, carpet sanitization, kitchen degreasing, and sofa shampooing.", "Sparkles", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"),
                    new ServiceCategory("Appliance Repair", "Fast diagnosis and repair for refrigerators, washing machines, microwaves, and AC units.", "Tv", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"),
                    new ServiceCategory("Carpentry & Woodwork", "Custom furniture crafting, door framing, cabinet repair, and architectural woodwork.", "Hammer", "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"),
                    new ServiceCategory("Painting & Finishing", "Interior and exterior wall painting, waterproof coating, and decorative textures.", "Paintbrush", "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80")
            );
            categoryRepository.saveAll(categories);
            System.out.println(">>> Seeded default Service Categories.");
        }
    }

    private void seedSampleDataIfEmpty() {
        if (providerProfileRepository.count() == 0) {
            // Seed a sample provider
            String providerEmail = "pro.john@servicehub.com";
            if (!userRepository.existsByEmail(providerEmail)) {
                User pUser = new User("John Carpenter", providerEmail, passwordEncoder.encode("Provider@123"), "+1-555-0144", "123 Craft St, Downtown", Role.PROVIDER);
                pUser = userRepository.save(pUser);

                ProviderProfile profile = new ProviderProfile(pUser, "Apex Plumbing & Repair Services", "Certified master plumber with over 8 years of residential & commercial experience.", 8, "New York");
                profile.setStatus(ProviderStatus.APPROVED);
                profile.setRating(4.9);
                profile.setTotalReviews(12);
                profile = providerProfileRepository.save(profile);

                ServiceCategory plumbing = categoryRepository.findByName("Plumbing & Pipefitting").orElse(null);
                if (plumbing != null) {
                    ProviderService service1 = new ProviderService(profile, plumbing, "Full Bathroom Plumbing Installation", "Complete pipe installation, vanity connection, and leak check.", new BigDecimal("150.00"), "Fixed");
                    ProviderService service2 = new ProviderService(profile, plumbing, "Emergency Leak Repair", "Fast response leak stoppage, pipe sealing, and pressure test.", new BigDecimal("75.00"), "Per Hour");
                    providerServiceRepository.saveAll(Arrays.asList(service1, service2));
                }
            }

            // Seed a sample customer
            String customerEmail = "customer.alice@gmail.com";
            if (!userRepository.existsByEmail(customerEmail)) {
                User cUser = new User("Alice Smith", customerEmail, passwordEncoder.encode("Customer@123"), "+1-555-0199", "456 Park Avenue, Apt 4B", Role.CUSTOMER);
                userRepository.save(cUser);
            }

            System.out.println(">>> Seeded sample Provider and Customer accounts.");
        }
    }
}
