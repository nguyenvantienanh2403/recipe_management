package com.N24_LTJavaNangCao.services;

import com.N24_LTJavaNangCao.dto.CategoryRequest;
import com.N24_LTJavaNangCao.entity.Category;
import com.N24_LTJavaNangCao.exception.AppException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

/**
 * Service quản lý danh mục món ăn (CRUD)
 */
@ApplicationScoped
public class CategoryService {

    public List<Category> getAllCategories() {
        return Category.listAll();
    }

    public Category getCategoryById(Long id) {
        Category cat = Category.findById(id);
        if (cat == null) throw AppException.notFound("Không tìm thấy danh mục");
        return cat;
    }

    @Transactional
    public Category createCategory(CategoryRequest req) {
        if (Category.findByName(req.name) != null) {
            throw AppException.conflict("Danh mục '" + req.name + "' đã tồn tại");
        }
        Category cat = new Category();
        cat.name = req.name;
        cat.description = req.description;
        cat.persist();
        return cat;
    }

    @Transactional
    public Category updateCategory(Long id, CategoryRequest req) {
        Category cat = Category.findById(id);
        if (cat == null) throw AppException.notFound("Không tìm thấy danh mục");

        cat.name = req.name;
        cat.description = req.description;
        return cat;
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category cat = Category.findById(id);
        if (cat == null) throw AppException.notFound("Không tìm thấy danh mục");
        cat.delete();
    }
}
