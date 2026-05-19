package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Bảng nguyên liệu riêng biệt (VD: Thịt bò, Hành tây, Nước mắm...)
 * Cho phép tái sử dụng nguyên liệu giữa các công thức
 */
@Entity
@Table(name = "ingredients")
public class Ingredient extends PanacheEntity {

    @Column(nullable = false, unique = true)
    public String name;

    // --- Panache finder methods ---
    public static Ingredient findByName(String name) {
        return find("name", name).firstResult();
    }
}
