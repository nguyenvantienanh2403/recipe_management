package com.N24_LTJavaNangCao.controllers;

import com.N24_LTJavaNangCao.dto.CommentRequest;
import com.N24_LTJavaNangCao.dto.CommentResponse;
import com.N24_LTJavaNangCao.services.CommentService;
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
 * Controller bình luận + đánh giá
 */
@Path("/api/comments")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Comments", description = "API bình luận và đánh giá")
public class CommentResource {

    @Inject
    CommentService commentService;

    @GET
    @Path("/recipe/{recipeId}")
    @PermitAll
    @Operation(summary = "Lấy danh sách comment của 1 recipe")
    public Response getCommentsByRecipe(@PathParam("recipeId") Long recipeId) {
        List<CommentResponse> comments = commentService.getCommentsByRecipe(recipeId);
        return Response.ok(comments).build();
    }

    @POST
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    @Operation(summary = "Thêm comment mới")
    public Response addComment(@Valid CommentRequest req, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        CommentResponse comment = commentService.addComment(req, email);
        return Response.status(Response.Status.CREATED).entity(comment).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ROLE_USER", "ROLE_ADMIN"})
    @Operation(summary = "Xóa comment (chủ comment hoặc admin)")
    public Response deleteComment(@PathParam("id") Long id, @Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        commentService.deleteComment(id, email);
        return Response.ok(Map.of("message", "Đã xóa bình luận")).build();
    }
}
