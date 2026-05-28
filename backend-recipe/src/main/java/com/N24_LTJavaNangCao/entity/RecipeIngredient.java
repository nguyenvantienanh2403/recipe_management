package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Bảng trung gian: liên kết Recipe <-> Ingredient với số lượng
 * VD: Phở Bò cần 500g Bánh phở, 300g Thịt bò...
 */
@Entity
@Table(name = "recipe_ingredients")
public class RecipeIngredient extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    @JsonIgnore
    public Recipe recipe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id", nullable = false)
    public Ingredient ingredient;

    public String quantity; // VD: "500g", "2 muỗng canh", "1 lon"

    // --- Panache finder methods ---
    public static List<RecipeIngredient> findByRecipeId(Long recipeId) {
        return find("recipe.id", recipeId).list();
    }

    public static long deleteByRecipeId(Long recipeId) {
        return delete("recipe.id", recipeId);
    }
}
