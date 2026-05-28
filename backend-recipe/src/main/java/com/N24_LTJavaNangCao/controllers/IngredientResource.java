package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.entity.Ingredient;
import com.N24_LTJavaNangCao.entity.RecipeIngredient;
import com.N24_LTJavaNangCao.exception.AppException;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

/**
 * Controller quản lý nguyên liệu
 */
@Path("/api/ingredients")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Ingredients", description = "API nguyên liệu")
public class IngredientResource {

    /**
     * Lấy danh sách tất cả nguyên liệu
     */
    @GET
    @PermitAll
    @Operation(summary = "Lấy danh sách tất cả nguyên liệu")
    public Response getAllIngredients() {
        List<Ingredient> ingredients = Ingredient.listAll();
        return Response.ok(ingredients).build();
    }

    /**
     * Admin thêm mới nguyên liệu chuẩn
     */
    @POST
    @RolesAllowed("ROLE_ADMIN")
    @Transactional
    @Operation(summary = "Admin thêm nguyên liệu mới")
    public Response createIngredient(Ingredient req) {
        if (req.name == null || req.name.isBlank()) {
            throw AppException.badRequest("Tên nguyên liệu không được để trống");
        }
        if (Ingredient.findByName(req.name) != null) {
            throw AppException.conflict("Nguyên liệu này đã tồn tại");
        }
        Ingredient ing = new Ingredient();
        ing.name = req.name.trim();
        ing.persist();
        return Response.status(Response.Status.CREATED).entity(ing).build();
    }

    /**
     * Admin sửa tên nguyên liệu chuẩn
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed("ROLE_ADMIN")
    @Transactional
    @Operation(summary = "Admin sửa tên nguyên liệu")
    public Response updateIngredient(@PathParam("id") Long id, Ingredient req) {
        if (req.name == null || req.name.isBlank()) {
            throw AppException.badRequest("Tên nguyên liệu không được để trống");
        }
        Ingredient ing = Ingredient.findById(id);
        if (ing == null) {
            throw AppException.notFound("Không tìm thấy nguyên liệu");
        }
        Ingredient duplicate = Ingredient.findByName(req.name);
        if (duplicate != null && !duplicate.id.equals(id)) {
            throw AppException.conflict("Tên nguyên liệu này đã tồn tại");
        }
        ing.name = req.name.trim();
        return Response.ok(ing).build();
    }

    /**
     * Admin xóa nguyên liệu chuẩn
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed("ROLE_ADMIN")
    @Transactional
    @Operation(summary = "Admin xóa nguyên liệu")
    public Response deleteIngredient(@PathParam("id") Long id) {
        Ingredient ing = Ingredient.findById(id);
        if (ing == null) {
            throw AppException.notFound("Không tìm thấy nguyên liệu");
        }
        // Xóa cascade các bản ghi phụ thuộc ở bảng trung gian recipe_ingredients
        RecipeIngredient.delete("ingredient.id", id);
        
        ing.delete();
        return Response.ok(java.util.Map.of("message", "Đã xóa nguyên liệu thành công")).build();
    }
}
