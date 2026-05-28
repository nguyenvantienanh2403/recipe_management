package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.dto.UserResponse;
import com.N24_LTJavaNangCao.entity.User;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller quản lý người dùng (chỉ Admin)
 * Cung cấp API lấy danh sách user - không trả về password
 */
@Path("/api/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Users", description = "API quản lý người dùng (Admin)")
public class UserResource {

    /**
     * Lấy danh sách tất cả người dùng
     * Chỉ Admin mới có quyền truy cập
     * Response trả về UserResponse DTO (ẩn mật khẩu)
     */
    @GET
    @RolesAllowed({"ROLE_ADMIN"})
    @Operation(summary = "Lấy danh sách tất cả người dùng (Admin only)")
    public Response getAllUsers() {
        List<UserResponse> users = User.<User>listAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
        return Response.ok(users).build();
    }
}
