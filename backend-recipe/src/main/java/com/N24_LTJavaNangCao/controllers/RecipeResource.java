package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.dto.*;
import com.N24_LTJavaNangCao.services.RecipeAppService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

/**
 * Controller quản lý công thức nấu ăn
 * Hỗ trợ: CRUD, tìm kiếm, phân trang, lọc theo category
 */
@Path("/api/recipes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Recipes", description = "API quản lý công thức nấu ăn")
public class RecipeResource {

    @Inject
    RecipeAppService recipeService;

    // --- 1. Tìm kiếm + Phân trang (cho trang chính) ---
    @GET
    @PermitAll
    @Operation(summary = "Lấy danh sách recipes có phân trang + tìm kiếm")
    public Response getRecipes(
            @QueryParam("keyword") String keyword,
            @QueryParam("categoryId") Long categoryId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("8") int size
    ) {
        PageResponse<RecipeResponse> result = recipeService.searchRecipes(keyword, categoryId, page, size);
        return Response.ok(result).build();
    }

    // --- 2. Lấy tất cả (cho dashboard, không phân trang) ---
    @GET
    @Path("/all")
    @PermitAll
    @Operation(summary = "Lấy toàn bộ recipes (cho dashboard)")
    public Response getAllRecipes() {
        List<RecipeResponse> recipes = recipeService.getAllRecipes();
        return Response.ok(recipes).build();
    }

    // --- 3. Lấy chi tiết 1 recipe ---
    @GET
    @Path("/{id}")
    @PermitAll
    @Operation(summary = "Lấy chi tiết 1 công thức")
    public Response getRecipeById(@PathParam("id") Long id) {
        RecipeResponse recipe = recipeService.getRecipeById(id);
        return Response.ok(recipe).build();
    }

    // --- 4. Tạo recipe mới (cần đăng nhập) ---
    @POST
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    @Operation(summary = "Tạo công thức mới")
    public Response createRecipe(@Valid RecipeRequest req, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        RecipeResponse recipe = recipeService.createRecipe(req, email);
        return Response.status(Response.Status.CREATED).entity(recipe).build();
    }

    // --- 5. Cập nhật recipe ---
    @PUT
    @Path("/{id}")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    @Operation(summary = "Cập nhật công thức")
    public Response updateRecipe(@PathParam("id") Long id, @Valid RecipeRequest req, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        RecipeResponse recipe = recipeService.updateRecipe(id, req, email);
        return Response.ok(recipe).build();
    }

    // --- 6. Xóa recipe ---
    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    @Operation(summary = "Xóa công thức")
    public Response deleteRecipe(@PathParam("id") Long id, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        recipeService.deleteRecipe(id, email);
        return Response.ok(Map.of("message", "Đã xóa công thức thành công")).build();
    }
}