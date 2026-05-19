package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity công thức món ăn - đã mở rộng thêm:
 * - Liên kết với Category (danh mục)
 * - Liên kết với User (người tạo)
 * - Trường description, createdAt, updatedAt
 * - Vẫn giữ lại ingredients/instructions dạng text[] cho tương thích
 */
@Entity
@Table(name = "recipe")
public class Recipe extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    public String image;

    @Column(length = 500)
    public String description; // Mô tả ngắn về món ăn

    public int prepTimeMinutes;
    public int cookTimeMinutes;
    public int servings;
    public String difficulty;
    public String cuisine;

    // Giữ dạng text[] để tương thích với data cũ và PostgreSQL
    @Column(columnDefinition = "text[]")
    public String[] ingredients;

    @Column(columnDefinition = "text[]")
    public String[] instructions;

    // Liên kết với danh mục
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    public Category category;

    // Người tạo công thức
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    public User user;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Panache finder methods ---

    /** Tìm theo category */
    public static List<Recipe> findByCategoryId(Long categoryId) {
        return find("category.id", categoryId).list();
    }

    /** Tìm theo user tạo */
    public static List<Recipe> findByUserId(Long userId) {
        return find("user.id", userId).list();
    }

    /** Tìm kiếm theo tên (LIKE, không phân biệt hoa thường) */
    public static List<Recipe> searchByName(String keyword) {
        return find("LOWER(name) LIKE LOWER(?1)", "%" + keyword + "%").list();
    }

    /** Phân trang + tìm kiếm tên + lọc category */
    public static List<Recipe> searchWithPagination(String keyword, Long categoryId, int page, int size) {
        String query = "1=1";
        java.util.Map<String, Object> params = new java.util.HashMap<>();

        if (keyword != null && !keyword.isBlank()) {
            query += " AND LOWER(name) LIKE LOWER(:keyword)";
            params.put("keyword", "%" + keyword + "%");
        }
        if (categoryId != null) {
            query += " AND category.id = :categoryId";
            params.put("categoryId", categoryId);
        }

        return find(query + " ORDER BY id DESC", params).page(page, size).list();
    }

    /** Đếm tổng kết quả tìm kiếm */
    public static long countSearch(String keyword, Long categoryId) {
        String query = "1=1";
        java.util.Map<String, Object> params = new java.util.HashMap<>();

        if (keyword != null && !keyword.isBlank()) {
            query += " AND LOWER(name) LIKE LOWER(:keyword)";
            params.put("keyword", "%" + keyword + "%");
        }
        if (categoryId != null) {
            query += " AND category.id = :categoryId";
            params.put("categoryId", categoryId);
        }

        return find(query, params).count();
    }
}