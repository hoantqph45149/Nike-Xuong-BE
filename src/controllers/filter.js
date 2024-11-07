import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const filterCategoryProduct = async (req, res, next) => {
  try {
    const { priceRanges, colors, genders, categoryId } = req.query;

    let products = [];

    if (categoryId) {
      // Tìm danh mục và populate danh sách sản phẩm nếu có categoryId
      const category = await Category.findById(categoryId).populate("products");

      if (!category) {
        return res.status(404).json({ error: "Danh mục không tồn tại" });
      }

      products = category.products;
    } else {
      // Lấy tất cả sản phẩm nếu không có categoryId
      products = await Product.find(); // Lấy tất cả sản phẩm từ bảng sản phẩm
    }
    // console.log(products);
    // Lọc theo khoảng giá
    if (priceRanges) {
      const ranges = JSON.parse(priceRanges); // Parse JSON string thành mảng
      products = products.filter((product) => {
        return ranges.some((range) => {
          const [minPrice, maxPrice] = range.split("-").map(Number);
          return product.price >= minPrice && product.price <= maxPrice;
        });
      });
    }

    // Lọc theo màu sắc
    if (colors) {
      const colorArray = JSON.parse(colors); // Parse mảng màu sắc
      products = products.filter(
        (product) =>
          product.colors.some((color) => colorArray.includes(color.color)) // Kiểm tra nếu có màu nào trong mảng colors
      );
    }
    console.log(products);
    // Lọc theo giới tính
    if (genders) {
      const genderArray = JSON.parse(genders); // Parse mảng giới tính
      products = products.filter((product) =>
        genderArray.includes(product.gender)
      );
    }

    res.json(products);
  } catch (err) {
    next(err);
  }
};
