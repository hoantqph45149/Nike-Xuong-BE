import Category from "../models/Category.js";
import Products from "../models/Product.js";
export const searchProduct = async (req, res, next) => {
  const { q, page = 1, limit = 10, sort = "name", order = "asc" } = req.query;
  try {
    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;
    const data = await Products.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Products.countDocuments({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "Khong tim thay san pham nao!",
      });
    }

    res.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      data,
    });
  } catch (error) {
    next(error);
  }
};
