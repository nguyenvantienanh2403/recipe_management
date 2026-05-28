package com.N24_LTJavaNangCao.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO để tạo/cập nhật công thức món ăn
 */
public class RecipeRequest {
    @NotBlank(message = "Tên món ăn không được để trống")
    public String name;

    public String image;
    public String description;
    public int prepTimeMinutes;
    public int cookTimeMinutes;
    public int servings;
    public String difficulty;
    public String cuisine;
    public String[] ingredients;
    public String[] instructions;
    public Long categoryId; // ID danh mục

    public java.util.List<IngredientItemRequest> recipeIngredients;

    public static class IngredientItemRequest {
        public Long ingredientId;
        public String quantity;
    }
}
