package com.N24_LTJavaNangCao.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO cho Category CRUD
 */
public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    public String name;

    public String description;
}
