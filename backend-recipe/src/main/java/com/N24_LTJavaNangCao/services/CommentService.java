package com.N24_LTJavaNangCao.services;

import com.N24_LTJavaNangCao.dto.CommentRequest;
import com.N24_LTJavaNangCao.dto.CommentResponse;
import com.N24_LTJavaNangCao.entity.Comment;
import com.N24_LTJavaNangCao.entity.Recipe;
import com.N24_LTJavaNangCao.entity.User;
import com.N24_LTJavaNangCao.exception.AppException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý bình luận + đánh giá
 */
@ApplicationScoped
public class CommentService {

    /**
     * Lấy danh sách comment theo recipe ID
     */
    public List<CommentResponse> getCommentsByRecipe(Long recipeId) {
        return Comment.findByRecipeId(recipeId).stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Thêm comment mới cho 1 recipe
     */
    @Transactional
    public CommentResponse addComment(CommentRequest req, String userEmail) {
        User user = User.findByEmail(userEmail);
        if (user == null) throw AppException.unauthorized("Không tìm thấy tài khoản");

        Recipe recipe = Recipe.findById(req.recipeId);
        if (recipe == null) throw AppException.notFound("Không tìm thấy công thức");

        Comment comment = new Comment();
        comment.content = req.content;
        comment.rating = Math.max(1, Math.min(5, req.rating)); // Đảm bảo 1-5
        comment.user = user;
        comment.recipe = recipe;
        comment.persist();

        return CommentResponse.fromEntity(comment);
    }

    /**
     * Xóa comment - chỉ cho phép chủ comment hoặc admin
     */
    @Transactional
    public void deleteComment(Long commentId, String userEmail) {
        Comment comment = Comment.findById(commentId);
        if (comment == null) throw AppException.notFound("Không tìm thấy bình luận");

        User user = User.findByEmail(userEmail);
        if (user == null) throw AppException.unauthorized("Không tìm thấy tài khoản");

        // Kiểm tra quyền: phải là chủ comment hoặc admin
        boolean isOwner = comment.user.id.equals(user.id);
        boolean isAdmin = user.role == com.N24_LTJavaNangCao.entity.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw AppException.forbidden("Bạn không có quyền xóa bình luận này");
        }

        comment.delete();
    }
}
