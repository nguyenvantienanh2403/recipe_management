package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Bình luận và đánh giá cho công thức
 * rating: 1-5 sao, content: nội dung bình luận
 */
@Entity
@Table(name = "comments")
public class Comment extends PanacheEntity {

    @Column(nullable = false, length = 1000)
    public String content;

    @Column(nullable = false)
    public int rating; // 1-5 sao

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    public Recipe recipe;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // --- Panache finder methods ---
    public static List<Comment> findByRecipeId(Long recipeId) {
        return find("recipe.id", recipeId).list();
    }

    public static List<Comment> findByUserId(Long userId) {
        return find("user.id", userId).list();
    }

    public static long deleteByIdAndUserId(Long commentId, Long userId) {
        return delete("id = ?1 AND user.id = ?2", commentId, userId);
    }
}
