package com.N24_LTJavaNangCao.config;

import com.N24_LTJavaNangCao.entity.*;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDateTime;

/**
 * Khởi tạo dữ liệu mẫu khi ứng dụng bắt đầu
 * Chỉ chạy nếu chưa có dữ liệu (kiểm tra bảng roles)
 */
@ApplicationScoped
public class DataInitializer {

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        // Chỉ seed nếu chưa có user
        if (User.count() > 0) return;

        // === 2. USERS (mật khẩu: 123456) ===
        String hashedPassword = BCrypt.hashpw("123456", BCrypt.gensalt(12));

        User admin = new User();
        admin.name = "Admin";
        admin.email = "admin@gmail.com";
        admin.password = hashedPassword;
        admin.role = Role.ADMIN;
        admin.createdAt = LocalDateTime.now();
        admin.persist();

        User user1 = new User();
        user1.name = "Nguyễn Văn A";
        user1.email = "user@gmail.com";
        user1.password = hashedPassword;
        user1.role = Role.USER;
        user1.createdAt = LocalDateTime.now();
        user1.persist();

        User user2 = new User();
        user2.name = "Trần Thị B";
        user2.email = "user2@gmail.com";
        user2.password = hashedPassword;
        user2.role = Role.USER;
        user2.createdAt = LocalDateTime.now();
        user2.persist();

        // === 3. CATEGORIES ===
        Category cat1 = createCategory("Món chính", "Các món ăn chính trong bữa cơm hàng ngày");
        Category cat2 = createCategory("Món nước", "Các món phở, bún, miến, hủ tiếu...");
        Category cat3 = createCategory("Món ăn vặt", "Bánh mì, đồ ăn nhanh, snack...");
        Category cat4 = createCategory("Tráng miệng", "Chè, bánh ngọt, kem...");
        Category cat5 = createCategory("Món gỏi/cuốn", "Gỏi cuốn, gỏi trộn, nem cuốn...");

        // === 4. RECIPES ===
        Recipe r1 = createRecipe("Phở Bò Hà Nội",
            "https://upload.wikimedia.org/wikipedia/commons/5/53/Pho-Beef-Noodles-2008.jpg",
            "Phở bò truyền thống Hà Nội với nước dùng trong, ngọt tự nhiên từ xương bò ninh lâu.",
            30, 120, 4, "Trung bình", "Việt Nam",
            new String[]{"500g Bánh phở", "300g Thịt bò thăn", "1kg Xương bò", "Gừng, hành tím nướng", "Hoa hồi, quế, thảo quả", "Hành lá, rau mùi"},
            new String[]{"Rửa sạch xương bò và ninh trong 2 tiếng.", "Nướng thơm gừng, hành tím, hoa hồi, quế.", "Nêm nếm gia vị vừa ăn.", "Thái mỏng thịt bò, chần bánh phở.", "Xếp bánh phở, thịt bò, chan nước dùng sôi."},
            cat2, admin);

        Recipe r2 = createRecipe("Bún Chả Hà Nội",
            "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/bun_cha_ha_noi_gan_day_01_4289b0a98e.jpg",
            "Bún chả Hà Nội thơm lừng với thịt nướng than hoa và nước chấm chua ngọt.",
            45, 30, 3, "Dễ", "Việt Nam",
            new String[]{"500g Thịt ba chỉ", "500g Bún tươi", "Đu đủ xanh, cà rốt", "Nước mắm, đường, dấm", "Rau sống các loại"},
            new String[]{"Ướp thịt ba chỉ với nước mắm, đường.", "Nướng thịt trên than hoa.", "Pha nước chấm chua ngọt.", "Ngâm đu đủ, cà rốt vào nước chấm.", "Bày bún, thịt nướng, rau sống."},
            cat2, admin);

        Recipe r3 = createRecipe("Cơm Tấm Sườn Nướng",
            "https://sumgroup.vn/datafiles/1/2023-03/31848625-com-tam-suon-bi-ba-chi.png",
            "Cơm tấm Sài Gòn với sườn nướng thơm phức, mỡ hành béo ngậy.",
            30, 45, 2, "Trung bình", "Việt Nam",
            new String[]{"500g Sườn cốt lết", "300g Gạo tấm", "Mật ong, sả, tỏi", "Nước mắm, đường, tiêu", "Mỡ hành, đồ chua"},
            new String[]{"Vo gạo tấm và nấu chín.", "Ướp sườn với mật ong, sả, tỏi.", "Nướng sườn đến khi xém vàng.", "Làm mỡ hành và nước mắm.", "Xới cơm, đặt sườn, rưới mỡ hành."},
            cat1, user1);

        Recipe r4 = createRecipe("Bún Bò Huế",
            "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture/News/News_expe_15656/15656.png?version=050202",
            "Bún bò Huế cay nồng đậm đà với mắm ruốc và sả.",
            60, 180, 6, "Khó", "Việt Nam",
            new String[]{"1kg Xương bò", "500g Bắp bò", "Giò heo", "Mắm ruốc Huế, sả", "Bún sợi to"},
            new String[]{"Chần xương và thịt.", "Hầm xương với sả, mắm ruốc.", "Phi thơm hành tỏi, sả.", "Luộc giò heo, thái lát bắp bò.", "Cho bún ra bát, xếp thịt, chan nước dùng."},
            cat2, admin);

        Recipe r5 = createRecipe("Bánh Mì Thịt Nướng",
            "https://upload.wikimedia.org/wikipedia/commons/0/0c/B%C3%A1nh_m%C3%AC_th%E1%BB%8Bt_n%C6%B0%E1%BB%9Bng.png",
            "Bánh mì Việt Nam giòn rụm kẹp thịt nướng thơm lừng.",
            20, 20, 4, "Dễ", "Việt Nam",
            new String[]{"4 Ổ bánh mì", "400g Thịt heo", "Dưa leo, đồ chua", "Tương ớt, bơ, pate", "Dầu hào, mè rang"},
            new String[]{"Ướp thịt heo với dầu hào, mè.", "Nướng thịt chín vàng.", "Rạch bánh mì, phết bơ pate.", "Xếp nhân vào bánh mì.", "Làm nóng bánh mì cho giòn."},
            cat3, user1);

        Recipe r6 = createRecipe("Gỏi Cuốn Tôm Thịt",
            "https://giavichinsu.com/wp-content/uploads/2018/04/nguyen-lieu-lam-goi-cuon-tom-thit.jpg",
            "Gỏi cuốn tươi mát với tôm và thịt ba chỉ.",
            30, 20, 4, "Dễ", "Việt Nam",
            new String[]{"300g Tôm sú", "300g Thịt ba chỉ", "Bánh tráng cuốn", "Bún tươi", "Rau thơm", "Tương đậu phộng"},
            new String[]{"Luộc tôm, bóc vỏ. Luộc thịt, thái mỏng.", "Rửa rau sạch.", "Làm ẩm bánh tráng, xếp nhân.", "Cuộn chặt tay.", "Làm nước chấm đậu phộng."},
            cat5, user2);

        Recipe r7 = createRecipe("Bò Lúc Lắc Khoai Tây",
            "https://www.maggi.com.vn/sites/default/files/srh_recipes/6104359fcea44f6897c0b20390db861d.png",
            "Bò lúc lắc xào nhanh lửa lớn, ăn kèm khoai tây chiên.",
            20, 15, 3, "Trung bình", "Việt Nam",
            new String[]{"400g Thịt bò thăn", "Hành tây, ớt chuông", "300g Khoai tây", "Nước tương, dầu hào", "Tỏi băm, bơ lạt"},
            new String[]{"Cắt bò khối vuông, ướp gia vị.", "Thái hành tây, ớt chuông.", "Chiên giòn khoai tây.", "Xào hành tây, ớt chuông.", "Lắc bò lửa lớn, trộn đều."},
            cat1, admin);

        Recipe r8 = createRecipe("Chè Trôi Nước Cốt Dừa",
            "https://i.ex-cdn.com/nongnghiepmoitruong.vn/files/content/2024/12/20/thanh-pham-20-145748_931-153012.jpeg",
            "Chè trôi nước nhân đậu xanh chan nước cốt dừa béo ngậy.",
            45, 30, 5, "Trung bình", "Việt Nam",
            new String[]{"500g Bột nếp", "200g Đậu xanh", "300g Đường thốt nốt", "Gừng, mè rang", "Nước cốt dừa"},
            new String[]{"Hấp đậu xanh, sên với đường.", "Nhồi bột nếp, bọc nhân.", "Nấu nước đường thốt nốt.", "Thả trôi nước vào nồi.", "Múc ra bát, chan nước cốt dừa."},
            cat4, user2);

        // === 5. COMMENTS ===
        createComment("Phở ngon tuyệt vời, nước dùng trong veo!", 5, user1, r1);
        createComment("Bún chả nướng rất thơm, nước chấm vừa miệng.", 4, user2, r2);
        createComment("Cơm tấm đúng vị Sài Gòn!", 5, user1, r3);
        createComment("Bún bò Huế cay nồng đậm đà.", 5, user2, r4);
        createComment("Bánh mì giòn rụm, nhân vừa ăn.", 4, user1, r5);
        createComment("Gỏi cuốn tươi mát, nước chấm ngon.", 4, user2, r6);

        // === 6. FAVORITES ===
        createFavorite(user1, r1);
        createFavorite(user1, r3);
        createFavorite(user1, r5);
        createFavorite(user2, r2);
        createFavorite(user2, r4);
        createFavorite(user2, r6);

        System.out.println("✅ Seed data initialized successfully!");
    }

    private Category createCategory(String name, String desc) {
        Category c = new Category();
        c.name = name;
        c.description = desc;
        c.persist();
        return c;
    }

    private Recipe createRecipe(String name, String image, String desc, int prep, int cook, int servings,
                                 String diff, String cuisine, String[] ingredients, String[] instructions,
                                 Category cat, User user) {
        Recipe r = new Recipe();
        r.name = name; r.image = image; r.description = desc;
        r.prepTimeMinutes = prep; r.cookTimeMinutes = cook; r.servings = servings;
        r.difficulty = diff; r.cuisine = cuisine;
        r.ingredients = ingredients; r.instructions = instructions;
        r.category = cat; r.user = user;
        r.persist();
        return r;
    }

    private void createComment(String content, int rating, User user, Recipe recipe) {
        Comment c = new Comment();
        c.content = content; c.rating = rating; c.user = user; c.recipe = recipe;
        c.persist();
    }

    private void createFavorite(User user, Recipe recipe) {
        Favorite f = new Favorite();
        f.user = user; f.recipe = recipe;
        f.persist();
    }
}
