package com.N24_LTJavaNangCao.dto;

import com.N24_LTJavaNangCao.entity.RecipeIngredient;

/**
 * DTO response cho quan hệ RecipeIngredient
 * Giúp biểu diễn thông tin nguyên liệu và định lượng tương ứng
 */
public class RecipeIngredientResponse {
    public Long id;
    public Long ingredientId;
    public String ingredientName;
    public String quantity;

    public static RecipeIngredientResponse fromEntity(RecipeIngredient ri) {
        RecipeIngredientResponse dto = new RecipeIngredientResponse();
        dto.id = ri.id;
        if (ri.ingredient != null) {
            dto.ingredientId = ri.ingredient.id;
            dto.ingredientName = ri.ingredient.name;
        }
        dto.quantity = ri.quantity;
        return dto;
    }
}
