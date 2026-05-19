package com.N24_LTJavaNangCao.dto;

import com.N24_LTJavaNangCao.entity.Comment;
import java.time.LocalDateTime;

/**
 * DTO response cho Comment - bao gồm user name
 */
public class CommentResponse {
    public Long id;
    public String content;
    public int rating;
    public Long userId;
    public String userName;
    public String userAvatar;
    public Long recipeId;
    public LocalDateTime createdAt;

    public static CommentResponse fromEntity(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.id = comment.id;
        dto.content = comment.content;
        dto.rating = comment.rating;
        dto.recipeId = comment.recipe.id;
        dto.createdAt = comment.createdAt;

        if (comment.user != null) {
            dto.userId = comment.user.id;
            dto.userName = comment.user.name;
            dto.userAvatar = comment.user.avatar;
        }
        return dto;
    }
}
