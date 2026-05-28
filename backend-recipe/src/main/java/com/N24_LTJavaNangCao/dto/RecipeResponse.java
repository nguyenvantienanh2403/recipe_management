package com.N24_LTJavaNangCao.dto;

import com.N24_LTJavaNangCao.entity.Recipe;
import java.time.LocalDateTime;

/**
 * DTO response cho Recipe - không trả entity trực tiếp
 * Bao gồm thông tin category name, user name, average rating
 */
public class RecipeResponse {
    public Long id;
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
    public Long categoryId;
    public String categoryName;
    public Long userId;
    public String userName;
    public double averageRating;
    public int totalComments;
    public LocalDateTime createdAt;
    public java.util.List<RecipeIngredientResponse> recipeIngredients;

    public RecipeResponse() {}

    /** Chuyển từ entity sang DTO */
    public static RecipeResponse fromEntity(Recipe recipe) {
        RecipeResponse dto = new RecipeResponse();
        dto.id = recipe.id;
        dto.name = recipe.name;
        dto.image = recipe.image;
        dto.description = recipe.description;
        dto.prepTimeMinutes = recipe.prepTimeMinutes;
        dto.cookTimeMinutes = recipe.cookTimeMinutes;
        dto.servings = recipe.servings;
        dto.difficulty = recipe.difficulty;
        dto.cuisine = recipe.cuisine;
        dto.ingredients = recipe.ingredients;
        dto.instructions = recipe.instructions;
        dto.createdAt = recipe.createdAt;

        if (recipe.category != null) {
            dto.categoryId = recipe.category.id;
            dto.categoryName = recipe.category.name;
        }
        if (recipe.user != null) {
            dto.userId = recipe.user.id;
            dto.userName = recipe.user.name;
        }
        return dto;
    }
}
