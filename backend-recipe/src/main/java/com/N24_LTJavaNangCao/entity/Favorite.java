package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.List;

/**
 * Bảng yêu thích - quan hệ Many-to-Many giữa User và Recipe
 * Mỗi bản ghi = 1 user yêu thích 1 recipe
 */
@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "recipe_id"})
})
public class Favorite extends PanacheEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipe_id", nullable = false)
    public Recipe recipe;

    // --- Panache finder methods ---
    public static List<Favorite> findByUserId(Long userId) {
        return find("user.id", userId).list();
    }

    public static Favorite findByUserAndRecipe(Long userId, Long recipeId) {
        return find("user.id = ?1 AND recipe.id = ?2", userId, recipeId).firstResult();
    }

    public static long deleteByUserAndRecipe(Long userId, Long recipeId) {
        return delete("user.id = ?1 AND recipe.id = ?2", userId, recipeId);
    }

    public static boolean isFavorite(Long userId, Long recipeId) {
        return count("user.id = ?1 AND recipe.id = ?2", userId, recipeId) > 0;
    }
}
