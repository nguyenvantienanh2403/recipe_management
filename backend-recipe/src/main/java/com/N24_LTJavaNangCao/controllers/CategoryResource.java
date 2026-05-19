package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.dto.CategoryRequest;
import com.N24_LTJavaNangCao.entity.Category;
import com.N24_LTJavaNangCao.services.CategoryService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.Map;

/**
 * Controller quản lý danh mục (Category)
 * GET: ai cũng xem được, CUD: chỉ admin
 */
@Path("/api/categories")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Categories", description = "API quản lý danh mục món ăn")
public class CategoryResource {

    @Inject
    CategoryService categoryService;

    @GET
    @PermitAll
    @Operation(summary = "Lấy tất cả danh mục")
    public Response getAllCategories() {
        return Response.ok(categoryService.getAllCategories()).build();
    }

    @GET
    @Path("/{id}")
    @PermitAll
    @Operation(summary = "Lấy chi tiết 1 danh mục")
    public Response getCategoryById(@PathParam("id") Long id) {
        return Response.ok(categoryService.getCategoryById(id)).build();
    }

    @POST
    @RolesAllowed({"ROLE_ADMIN"})
    @Operation(summary = "Tạo danh mục mới (Admin)")
    public Response createCategory(@Valid CategoryRequest req) {
        Category cat = categoryService.createCategory(req);
        return Response.status(Response.Status.CREATED).entity(cat).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"ROLE_ADMIN"})
    @Operation(summary = "Cập nhật danh mục (Admin)")
    public Response updateCategory(@PathParam("id") Long id, @Valid CategoryRequest req) {
        Category cat = categoryService.updateCategory(id, req);
        return Response.ok(cat).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ROLE_ADMIN"})
    @Operation(summary = "Xóa danh mục (Admin)")
    public Response deleteCategory(@PathParam("id") Long id) {
        categoryService.deleteCategory(id);
        return Response.ok(Map.of("message", "Đã xóa danh mục")).build();
    }
}
