package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.services.FavoriteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
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
 * Controller quản lý danh sách yêu thích (Favorite)
 */
@Path("/api/favorites")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
@Tag(name = "Favorites", description = "API quản lý yêu thích")
public class FavoriteResource {

    @Inject
    FavoriteService favoriteService;

    @GET
    @Operation(summary = "Lấy danh sách recipe ID yêu thích của user")
    public Response getFavorites(@Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        List<Long> favoriteIds = favoriteService.getFavoriteRecipeIds(email);
        return Response.ok(Map.of("favoriteIds", favoriteIds)).build();
    }

    @POST
    @Path("/{recipeId}")
    @Operation(summary = "Toggle yêu thích (thêm/bỏ)")
    public Response toggleFavorite(@PathParam("recipeId") Long recipeId, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        boolean added = favoriteService.toggleFavorite(recipeId, email);
        return Response.ok(Map.of(
                "message", added ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích",
                "isFavorite", added
        )).build();
    }

    @GET
    @Path("/check/{recipeId}")
    @Operation(summary = "Kiểm tra recipe có trong danh sách yêu thích")
    public Response checkFavorite(@PathParam("recipeId") Long recipeId, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        boolean isFav = favoriteService.isFavorite(recipeId, email);
        return Response.ok(Map.of("isFavorite", isFav)).build();
    }
}
