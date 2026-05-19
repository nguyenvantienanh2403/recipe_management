package com.N24_LTJavaNangCao.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity người dùng - thay thế MyClient cũ
 * Hỗ trợ vai trò (role) để phân quyền User / Admin
 */
@Entity
@Table(name = "users")
public class User extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(nullable = false, unique = true)
    public String email;

    @Column(nullable = false)
    public String password;

    public String avatar; // URL ảnh đại diện

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Role role;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // --- Panache finder methods ---
    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public static List<User> findByNameContaining(String name) {
        return find("name LIKE ?1", "%" + name + "%").list();
    }
}
