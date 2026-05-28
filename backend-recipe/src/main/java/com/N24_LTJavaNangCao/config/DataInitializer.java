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

        // === 7. INGREDIENTS (Nguyên liệu chuẩn hóa cho tìm kiếm tủ lạnh) ===
        Ingredient banhPho = createIngredient("Bánh phở");
        Ingredient thitBo = createIngredient("Thịt bò");
        Ingredient xuongBo = createIngredient("Xương bò");
        Ingredient gung = createIngredient("Gừng");
        Ingredient hanhTim = createIngredient("Hành tím");
        Ingredient hanhLa = createIngredient("Hành lá");
        Ingredient thitBaChi = createIngredient("Thịt ba chỉ");
        Ingredient bunTuoi = createIngredient("Bún tươi");
        Ingredient nuocMam = createIngredient("Nước mắm");
        Ingredient duong = createIngredient("Đường");
        Ingredient suonCotLet = createIngredient("Sườn cốt lết");
        Ingredient gaoTam = createIngredient("Gạo tấm");
        Ingredient matOng = createIngredient("Mật ong");
        Ingredient sa = createIngredient("Sả");
        Ingredient toi = createIngredient("Tỏi");
        Ingredient bapBo = createIngredient("Bắp bò");
        Ingredient gioHeo = createIngredient("Giò heo");
        Ingredient mamRuoc = createIngredient("Mắm ruốc");
        Ingredient banhMi = createIngredient("Bánh mì");
        Ingredient thitHeo = createIngredient("Thịt heo");
        Ingredient duaLeo = createIngredient("Dưa leo");
        Ingredient pate = createIngredient("Pate");
        Ingredient tomSu = createIngredient("Tôm sú");
        Ingredient banhTrang = createIngredient("Bánh tráng");
        Ingredient rauThom = createIngredient("Rau thơm");
        Ingredient khoaiTay = createIngredient("Khoai tây");
        Ingredient hanhTay = createIngredient("Hành tây");
        Ingredient otChuong = createIngredient("Ớt chuông");
        Ingredient dauHao = createIngredient("Dầu hào");
        Ingredient botNep = createIngredient("Bột nếp");
        Ingredient dauXanh = createIngredient("Đậu xanh");
        Ingredient nuocCotDua = createIngredient("Nước cốt dừa");
        Ingredient duongThotNot = createIngredient("Đường thốt nốt");

        // === 8. RECIPE_INGREDIENTS (Liên kết Recipe ↔ Ingredient) ===
        // Phở Bò Hà Nội
        linkIngredient(r1, banhPho, "500g");
        linkIngredient(r1, thitBo, "300g");
        linkIngredient(r1, xuongBo, "1kg");
        linkIngredient(r1, gung, "1 củ");
        linkIngredient(r1, hanhTim, "3 củ");
        linkIngredient(r1, hanhLa, "1 bó");

        // Bún Chả Hà Nội
        linkIngredient(r2, thitBaChi, "500g");
        linkIngredient(r2, bunTuoi, "500g");
        linkIngredient(r2, nuocMam, "3 muỗng");
        linkIngredient(r2, duong, "2 muỗng");

        // Cơm Tấm Sườn Nướng
        linkIngredient(r3, suonCotLet, "500g");
        linkIngredient(r3, gaoTam, "300g");
        linkIngredient(r3, matOng, "2 muỗng");
        linkIngredient(r3, sa, "2 cây");
        linkIngredient(r3, toi, "3 tép");
        linkIngredient(r3, nuocMam, "2 muỗng");

        // Bún Bò Huế
        linkIngredient(r4, xuongBo, "1kg");
        linkIngredient(r4, bapBo, "500g");
        linkIngredient(r4, gioHeo, "1 cái");
        linkIngredient(r4, mamRuoc, "2 muỗng");
        linkIngredient(r4, sa, "3 cây");
        linkIngredient(r4, bunTuoi, "500g");

        // Bánh Mì Thịt Nướng
        linkIngredient(r5, banhMi, "4 ổ");
        linkIngredient(r5, thitHeo, "400g");
        linkIngredient(r5, duaLeo, "2 quả");
        linkIngredient(r5, pate, "100g");
        linkIngredient(r5, dauHao, "1 muỗng");

        // Gỏi Cuốn Tôm Thịt
        linkIngredient(r6, tomSu, "300g");
        linkIngredient(r6, thitBaChi, "300g");
        linkIngredient(r6, banhTrang, "10 tấm");
        linkIngredient(r6, bunTuoi, "200g");
        linkIngredient(r6, rauThom, "1 bó");

        // Bò Lúc Lắc Khoai Tây
        linkIngredient(r7, thitBo, "400g");
        linkIngredient(r7, hanhTay, "1 củ");
        linkIngredient(r7, otChuong, "1 quả");
        linkIngredient(r7, khoaiTay, "300g");
        linkIngredient(r7, dauHao, "2 muỗng");
        linkIngredient(r7, toi, "4 tép");

        // Chè Trôi Nước Cốt Dừa
        linkIngredient(r8, botNep, "500g");
        linkIngredient(r8, dauXanh, "200g");
        linkIngredient(r8, duongThotNot, "300g");
        linkIngredient(r8, gung, "1 củ");
        linkIngredient(r8, nuocCotDua, "1 lon");

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

    private Ingredient createIngredient(String name) {
        Ingredient i = new Ingredient();
        i.name = name;
        i.persist();
        return i;
    }

    private void linkIngredient(Recipe recipe, Ingredient ingredient, String quantity) {
        RecipeIngredient ri = new RecipeIngredient();
        ri.recipe = recipe;
        ri.ingredient = ingredient;
        ri.quantity = quantity;
        ri.persist();
    }
}
