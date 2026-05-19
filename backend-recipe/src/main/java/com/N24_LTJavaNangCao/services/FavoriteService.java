package com.N24_LTJavaNangCao.services;

import com.N24_LTJavaNangCao.dto.RecipeResponse;
import com.N24_LTJavaNangCao.entity.Favorite;
import com.N24_LTJavaNangCao.entity.Recipe;
import com.N24_LTJavaNangCao.entity.User;
import com.N24_LTJavaNangCao.exception.AppException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý danh sách yêu thích (Favorite)
 */
@ApplicationScoped
public class FavoriteService {

    /**
     * Lấy danh sách recipe yêu thích của user (trả về ID list)
     */
    public List<Long> getFavoriteRecipeIds(String userEmail) {
        User user = User.findByEmail(userEmail);
        if (user == null) throw AppException.unauthorized("Không tìm thấy tài khoản");

        return Favorite.findByUserId(user.id).stream()
                .map(f -> f.recipe.id)
                .collect(Collectors.toList());
    }

    /**
     * Toggle yêu thích: nếu đã yêu thích thì bỏ, chưa thì thêm
     * Trả về true nếu đã thêm, false nếu đã bỏ
     */
    @Transactional
    public boolean toggleFavorite(Long recipeId, String userEmail) {
        User user = User.findByEmail(userEmail);
        if (user == null) throw AppException.unauthorized("Không tìm thấy tài khoản");

        Recipe recipe = Recipe.findById(recipeId);
        if (recipe == null) throw AppException.notFound("Không tìm thấy công thức");

        Favorite existing = Favorite.findByUserAndRecipe(user.id, recipeId);
        if (existing != null) {
            existing.delete();
            return false; // Đã bỏ yêu thích
        } else {
            Favorite fav = new Favorite();
            fav.user = user;
            fav.recipe = recipe;
            fav.persist();
            return true; // Đã thêm yêu thích
        }
    }

    /**
     * Kiểm tra 1 recipe có được user yêu thích hay không
     */
    public boolean isFavorite(Long recipeId, String userEmail) {
        User user = User.findByEmail(userEmail);
        if (user == null) return false;
        return Favorite.isFavorite(user.id, recipeId);
    }
}
