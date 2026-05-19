package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Danh mục phân loại món ăn (VD: Món chính, Tráng miệng, Món nước...)
 */
@Entity
@Table(name = "categories")
public class Category extends PanacheEntity {

    @Column(nullable = false, unique = true)
    public String name;

    public String description;

    // --- Panache finder methods ---
    public static Category findByName(String name) {
        return find("name", name).firstResult();
    }
}
