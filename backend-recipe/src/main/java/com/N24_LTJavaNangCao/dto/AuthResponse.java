package com.N24_LTJavaNangCao.dto;

/**
 * Response trả về sau khi login thành công
 */
public class AuthResponse {
    public String token;
    public String refreshToken;
    public Long userId;
    public String name;
    public String email;
    public String role;

    public AuthResponse() {}

    public AuthResponse(String token, String refreshToken, Long userId, String name, String email, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
