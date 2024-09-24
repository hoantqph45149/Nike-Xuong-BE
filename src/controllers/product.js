import Category from "../models/Category.js";
import Products from "../models/Product.js";

export const getList = async (req, res, next) => {
  const { page = 1, limit = 10, sort = "name", order = "asc" } = req.query;
  try {
    const skip = (page - 1) * limit;

    // Xác định thứ tự sắp xếp: 1 là tăng dần, -1 là giảm dần
    const sortOrder = order === "desc" ? -1 : 1;
    const data = await Products.find()
      .sort({ [sort]: sortOrder }) // Sắp xếp dựa trên trường 'sort' và 'order'
      .skip(skip)
      .limit(parseInt(limit))
      .populate("categoryId");

    const totalProducts = await Products.countDocuments();
    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "Khong tim thay san pham nao!",
      });
    }

    return res.status(200).json({
      message: "Lay san pham thanh cong!",
      data,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      message: "Tìm thấy sản phẩm",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const product = await Products.create(req.body);
    if (!product) {
      return res.status(400).json({
        message: "Tạo sản phẩm thất bại",
      });
    }
    const updateCategory = await Category.findByIdAndUpdate(
      product.categoryId,
      {
        $addToSet: {
          products: product._id,
        },
      }
    );
    if (!updateCategory) {
      return res.status(400).json({
        message: "Tạo san pham that bai",
      });
    }
    return res.status(200).json({
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (product) {
      return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        data: product,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (product) {
      return res.status(200).json({
        message: "xóa sản phẩm thành công",
        data: product,
      });
    }
  } catch (error) {
    next(error);
  }
};
