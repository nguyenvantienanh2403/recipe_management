package com.N24_LTJavaNangCao.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * DTO request cho tìm kiếm công thức theo nguyên liệu tủ lạnh
 * Nhận vào danh sách ID nguyên liệu mà người dùng đã chọn
 */
public class IngredientSearchRequest {

    @NotEmpty(message = "Vui lòng chọn ít nhất 1 nguyên liệu")
    public List<Long> ingredientIds;
}
