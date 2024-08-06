import Category from "../models/Category.js";
import Products from "../models/Product.js";

export const getList = async (req, res, next) => {
  try {
    const data = await Products.find().populate("categoryId");
    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "Khong tim thay san pham nao!",
      });
    }

    return res.status(200).json({
      message: "Lay san pham thanh cong!",
      data,
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
