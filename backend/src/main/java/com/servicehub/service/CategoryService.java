package com.servicehub.service;

import com.servicehub.dto.ServiceDTOs.CategoryDTO;
import com.servicehub.entity.ServiceCategory;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.ServiceCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToDTO(category);
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }
        ServiceCategory category = new ServiceCategory(
                dto.getName(),
                dto.getDescription(),
                dto.getIcon() != null ? dto.getIcon() : "Sparkles",
                dto.getImageUrl()
        );
        category = categoryRepository.save(category);
        return mapToDTO(category);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getIcon() != null) category.setIcon(dto.getIcon());
        if (dto.getImageUrl() != null) category.setImageUrl(dto.getImageUrl());
        category = categoryRepository.save(category);
        return mapToDTO(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO mapToDTO(ServiceCategory cat) {
        return new CategoryDTO(cat.getId(), cat.getName(), cat.getDescription(), cat.getIcon(), cat.getImageUrl());
    }
}
