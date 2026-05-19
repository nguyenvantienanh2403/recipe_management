package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.dto.*;
import com.N24_LTJavaNangCao.services.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/**
 * Controller xác thực người dùng
 * Endpoints: register, login, refresh, profile, logout
 */
@Path("/api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Authentication", description = "API xác thực người dùng")
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    JsonWebToken jwt;

    @POST
    @Path("/register")
    @PermitAll
    @Operation(summary = "Đăng ký tài khoản mới")
    public Response register(@Valid RegisterRequest req) {
        UserResponse user = authService.register(req);
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    @POST
    @Path("/login")
    @PermitAll
    @Operation(summary = "Đăng nhập - trả về JWT token")
    public Response login(@Valid LoginRequest req) {
        AuthResponse authResponse = authService.login(req);
        return Response.ok(authResponse).build();
    }

    @POST
    @Path("/refresh")
    @PermitAll
    @Operation(summary = "Refresh JWT token")
    public Response refreshToken(@Context SecurityContext ctx) {
        // Lấy email từ JWT để tạo token mới
        String email = jwt.getName();
        AuthResponse authResponse = authService.refreshToken(email);
        return Response.ok(authResponse).build();
    }

    @GET
    @Path("/profile")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    @Operation(summary = "Lấy thông tin profile người dùng")
    public Response getProfile(@Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        UserResponse user = authService.getProfile(email);
        return Response.ok(user).build();
    }

    @POST
    @Path("/logout")
    @PermitAll
    @Operation(summary = "Đăng xuất (client xóa token)")
    public Response logout() {
        // JWT là stateless, logout xử lý ở phía client (xóa token)
        return Response.ok().entity(java.util.Map.of("message", "Đăng xuất thành công")).build();
    }
}