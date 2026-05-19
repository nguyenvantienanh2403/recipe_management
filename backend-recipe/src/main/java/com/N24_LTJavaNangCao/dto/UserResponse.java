package com.N24_LTJavaNangCao.dto;

/**
 * DTO response cho User profile (không trả password)
 */
public class UserResponse {
    public Long id;
    public String name;
    public String email;
    public String avatar;
    public String role;
    public String createdAt;

    public UserResponse() {}

    public static UserResponse fromEntity(com.N24_LTJavaNangCao.entity.User user) {
        UserResponse dto = new UserResponse();
        dto.id = user.id;
        dto.name = user.name;
        dto.email = user.email;
        dto.avatar = user.avatar;
        dto.role = user.role != null ? "ROLE_" + user.role.name() : "ROLE_USER";
        dto.createdAt = user.createdAt != null ? user.createdAt.toString() : null;
        return dto;
    }
}
