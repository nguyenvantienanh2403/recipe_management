package com.N24_LTJavaNangCao.services;

import com.N24_LTJavaNangCao.dto.*;
import com.N24_LTJavaNangCao.entity.Role;
import com.N24_LTJavaNangCao.entity.User;
import com.N24_LTJavaNangCao.exception.AppException;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;

import java.time.Duration;
import java.util.Set;

/**
 * Service xác thực người dùng
 * Xử lý: đăng ký, đăng nhập, refresh token, lấy profile
 */
@ApplicationScoped
public class AuthService {

    private static final String ISSUER = "recipe-app";

    /**
     * Đăng ký tài khoản mới
     * - Kiểm tra email trùng
     * - Mã hóa mật khẩu bằng BCrypt
     * - Gán role mặc định là ROLE_USER
     */
    @Transactional
    public UserResponse register(RegisterRequest req) {
        // Kiểm tra email đã tồn tại
        if (User.findByEmail(req.email) != null) {
            throw AppException.conflict("Email đã được sử dụng");
        }

        // Tạo user mới
        User user = new User();
        user.name = req.name;
        user.email = req.email;
        user.password = BCrypt.hashpw(req.password, BCrypt.gensalt(12));

        // Gán role mặc định
        user.role = Role.USER;
        user.persist();

        return UserResponse.fromEntity(user);
    }

    /**
     * Đăng nhập - trả về JWT token + refresh token
     */
    public AuthResponse login(LoginRequest req) {
        User user = User.findByEmail(req.email);

        if (user == null || !BCrypt.checkpw(req.password, user.password)) {
            throw AppException.unauthorized("Sai email hoặc mật khẩu");
        }

        String roleName = user.role != null ? "ROLE_" + user.role.name() : "ROLE_USER";

        // Tạo access token (hết hạn sau 24 giờ)
        String token = Jwt.issuer(ISSUER)
                .upn(user.email)
                .groups(Set.of(roleName))
                .claim("userId", user.id)
                .claim("name", user.name)
                .expiresIn(Duration.ofHours(24))
                .sign();

        // Tạo refresh token (hết hạn sau 7 ngày)
        String refreshToken = Jwt.issuer(ISSUER)
                .upn(user.email)
                .claim("type", "refresh")
                .claim("userId", user.id)
                .expiresIn(Duration.ofDays(7))
                .sign();

        return new AuthResponse(token, refreshToken, user.id, user.name, user.email, roleName);
    }

    /**
     * Refresh access token từ refresh token
     * Frontend gọi khi access token hết hạn
     */
    public AuthResponse refreshToken(String email) {
        User user = User.findByEmail(email);
        if (user == null) {
            throw AppException.unauthorized("Không tìm thấy tài khoản");
        }

        String roleName = user.role != null ? "ROLE_" + user.role.name() : "ROLE_USER";

        String newToken = Jwt.issuer(ISSUER)
                .upn(user.email)
                .groups(Set.of(roleName))
                .claim("userId", user.id)
                .claim("name", user.name)
                .expiresIn(Duration.ofHours(24))
                .sign();

        String newRefreshToken = Jwt.issuer(ISSUER)
                .upn(user.email)
                .claim("type", "refresh")
                .claim("userId", user.id)
                .expiresIn(Duration.ofDays(7))
                .sign();

        return new AuthResponse(newToken, newRefreshToken, user.id, user.name, user.email, roleName);
    }

    /**
     * Lấy thông tin profile theo email (từ JWT)
     */
    public UserResponse getProfile(String email) {
        User user = User.findByEmail(email);
        if (user == null) {
            throw AppException.notFound("Không tìm thấy tài khoản");
        }
        return UserResponse.fromEntity(user);
    }
}
