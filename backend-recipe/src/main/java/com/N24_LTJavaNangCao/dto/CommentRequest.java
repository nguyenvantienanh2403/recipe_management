package com.N24_LTJavaNangCao.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO request để tạo comment
 */
public class CommentRequest {
    @NotBlank(message = "Nội dung bình luận không được để trống")
    public String content;

    @Min(value = 1, message = "Đánh giá tối thiểu 1 sao")
    @Max(value = 5, message = "Đánh giá tối đa 5 sao")
    public int rating;

    public Long recipeId;
}
