package com.N24_LTJavaNangCao.dto;

import java.util.List;

/**
 * DTO phân trang chung - dùng cho mọi API list có phân trang
 */
public class PageResponse<T> {
    public List<T> content;
    public int page;
    public int size;
    public long totalElements;
    public int totalPages;

    public PageResponse() {}

    public PageResponse(List<T> content, int page, int size, long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
    }
}
