export const exportToCSV = (recipes) => {
  const headers = [
    "ID",
    "Tên Món Ăn",
    "Độ Khó",
    "Chuẩn Bị (phút)",
    "Nấu (phút)",
    "Khẩu Phần",
    "Quốc Gia",
  ];
  const rows = recipes.map((r) => [
    r.id,
    `"${r.name}"`,
    r.difficulty,
    r.prepTimeMinutes,
    r.cookTimeMinutes || 0,
    r.servings,
    `"${r.cuisine || "Việt Nam"}"`,
  ]);
  let csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    headers.join(",") +
    "\n" +
    rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Danh_Sach_Mon_An.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
