package com.N24_LTJavaNangCao.services;

import com.N24_LTJavaNangCao.dto.*;
import com.N24_LTJavaNangCao.entity.*;
import com.N24_LTJavaNangCao.exception.AppException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

/**
 * Service xử lý CRUD Recipe với search + pagination
 * Chuyển đổi entity <-> DTO để không expose entity trực tiếp
 */
@ApplicationScoped
public class RecipeAppService {

    @Inject
    EntityManager em;

    /**
     * Tìm kiếm công thức theo danh sách nguyên liệu (tủ lạnh)
     * Sử dụng JPQL JOIN giữa Recipe ↔ RecipeIngredient ↔ Ingredient
     * Trả về các công thức có chứa BẤT KỲ nguyên liệu nào trong danh sách
     * Sắp xếp theo số nguyên liệu khớp giảm dần (món khớp nhiều nhất lên đầu)
     */
    public List<RecipeResponse> searchByIngredients(List<Long> ingredientIds) {
        String jpql = "SELECT r FROM Recipe r " +
                      "WHERE r.id IN (SELECT DISTINCT ri.recipe.id FROM RecipeIngredient ri WHERE ri.ingredient.id IN :ids) " +
                      "ORDER BY r.id DESC";

        List<Recipe> recipes = em.createQuery(jpql, Recipe.class)
                .setParameter("ids", ingredientIds)
                .getResultList();

        return recipes.stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm + phân trang + lọc category
     * Trả về PageResponse chứa danh sách RecipeResponse
     */
    public PageResponse<RecipeResponse> searchRecipes(String keyword, Long categoryId, int page, int size) {
        List<Recipe> recipes = Recipe.searchWithPagination(keyword, categoryId, page, size);
        long total = Recipe.countSearch(keyword, categoryId);

        List<RecipeResponse> dtoList = recipes.stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(dtoList, page, size, total);
    }

    /**
     * Lấy tất cả recipes (không phân trang - cho dashboard)
     */
    public List<RecipeResponse> getAllRecipes() {
        return Recipe.<Recipe>listAll().stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết 1 recipe
     */
    public RecipeResponse getRecipeById(Long id) {
        Recipe recipe = Recipe.findById(id);
        if (recipe == null) {
            throw AppException.notFound("Không tìm thấy công thức với ID: " + id);
        }
        return toRecipeResponse(recipe);
    }

    /**
     * Tạo recipe mới
     */
    @Transactional
    public RecipeResponse createRecipe(RecipeRequest req, String userEmail) {
        Recipe recipe = new Recipe();
        mapRequestToEntity(req, recipe);

        // Gán user tạo
        User user = User.findByEmail(userEmail);
        if (user != null) {
            recipe.user = user;
        }

        // Gán category nếu có
        if (req.categoryId != null) {
            Category cat = Category.findById(req.categoryId);
            if (cat != null) recipe.category = cat;
        }

        // Đồng thời cập nhật trường text[] ingredients để tương thích ngược
        if (req.recipeIngredients != null) {
            List<String> list = new java.util.ArrayList<>();
            for (RecipeRequest.IngredientItemRequest item : req.recipeIngredients) {
                if (item.ingredientId == null) continue;
                Ingredient ingredient = Ingredient.findById(item.ingredientId);
                if (ingredient != null) {
                    list.add(ingredient.name + ": " + (item.quantity != null ? item.quantity : ""));
                }
            }
            recipe.ingredients = list.toArray(new String[0]);
        }

        recipe.persist();

        // Lưu các RecipeIngredient liên kết vào bảng trung gian
        if (req.recipeIngredients != null) {
            for (RecipeRequest.IngredientItemRequest item : req.recipeIngredients) {
                if (item.ingredientId == null) continue;
                Ingredient ingredient = Ingredient.findById(item.ingredientId);
                if (ingredient != null) {
                    RecipeIngredient ri = new RecipeIngredient();
                    ri.recipe = recipe;
                    ri.ingredient = ingredient;
                    ri.quantity = item.quantity;
                    ri.persist();
                }
            }
        }

        return toRecipeResponse(recipe);
    }

    /**
     * Cập nhật recipe
     */
    @Transactional
    public RecipeResponse updateRecipe(Long id, RecipeRequest req, String userEmail) {
        Recipe recipe = Recipe.findById(id);
        if (recipe == null) {
            throw AppException.notFound("Không tìm thấy công thức để cập nhật");
        }

        User user = User.findByEmail(userEmail);
        if (user == null || (user.role != Role.ADMIN && (recipe.user == null || !recipe.user.id.equals(user.id)))) {
            throw AppException.unauthorized("Bạn không có quyền cập nhật công thức này");
        }

        mapRequestToEntity(req, recipe);

        if (req.categoryId != null) {
            Category cat = Category.findById(req.categoryId);
            if (cat != null) recipe.category = cat;
        } else {
            recipe.category = null;
        }

        // Xóa các liên kết RecipeIngredient cũ
        RecipeIngredient.deleteByRecipeId(id);

        // Lưu các liên kết RecipeIngredient mới
        if (req.recipeIngredients != null) {
            for (RecipeRequest.IngredientItemRequest item : req.recipeIngredients) {
                if (item.ingredientId == null) continue;
                Ingredient ingredient = Ingredient.findById(item.ingredientId);
                if (ingredient != null) {
                    RecipeIngredient ri = new RecipeIngredient();
                    ri.recipe = recipe;
                    ri.ingredient = ingredient;
                    ri.quantity = item.quantity;
                    ri.persist();
                }
            }
        }

        // Đồng thời cập nhật trường text[] ingredients để tương thích ngược
        if (req.recipeIngredients != null) {
            List<String> list = new java.util.ArrayList<>();
            for (RecipeRequest.IngredientItemRequest item : req.recipeIngredients) {
                if (item.ingredientId == null) continue;
                Ingredient ingredient = Ingredient.findById(item.ingredientId);
                if (ingredient != null) {
                    list.add(ingredient.name + ": " + (item.quantity != null ? item.quantity : ""));
                }
            }
            recipe.ingredients = list.toArray(new String[0]);
        }

        return toRecipeResponse(recipe);
    }

    /**
     * Xóa recipe + cascade xóa comments, favorites liên quan
     */
    @Transactional
    public void deleteRecipe(Long id, String userEmail) {
        Recipe recipe = Recipe.findById(id);
        if (recipe == null) {
            throw AppException.notFound("Không tìm thấy công thức để xóa");
        }

        User user = User.findByEmail(userEmail);
        if (user == null || (user.role != Role.ADMIN && (recipe.user == null || !recipe.user.id.equals(user.id)))) {
            throw AppException.unauthorized("Bạn không có quyền xóa công thức này");
        }

        // Xóa các bản ghi liên quan trước
        Comment.delete("recipe.id", id);
        Favorite.delete("recipe.id", id);
        RecipeIngredient.deleteByRecipeId(id);

        recipe.delete();
    }

    // --- Helper methods ---

    private void mapRequestToEntity(RecipeRequest req, Recipe recipe) {
        recipe.name = req.name;
        recipe.image = req.image;
        recipe.description = req.description;
        recipe.prepTimeMinutes = req.prepTimeMinutes;
        recipe.cookTimeMinutes = req.cookTimeMinutes;
        recipe.servings = req.servings;
        recipe.difficulty = req.difficulty;
        recipe.cuisine = req.cuisine;
        recipe.ingredients = req.ingredients;
        recipe.instructions = req.instructions;
    }

    /**
     * Chuyển Recipe entity -> RecipeResponse DTO
     * Bổ sung averageRating và totalComments từ bảng comments
     */
    private RecipeResponse toRecipeResponse(Recipe recipe) {
        RecipeResponse dto = RecipeResponse.fromEntity(recipe);

        // Nạp danh sách nguyên liệu quan hệ
        List<RecipeIngredient> riList = RecipeIngredient.findByRecipeId(recipe.id);
        dto.recipeIngredients = riList.stream()
                .map(RecipeIngredientResponse::fromEntity)
                .collect(Collectors.toList());

        // Tính rating trung bình và tổng comment
        List<Comment> comments = Comment.findByRecipeId(recipe.id);
        dto.totalComments = comments.size();
        if (!comments.isEmpty()) {
            dto.averageRating = comments.stream()
                    .mapToInt(c -> c.rating)
                    .average()
                    .orElse(0.0);
        }
        return dto;
    }
}
