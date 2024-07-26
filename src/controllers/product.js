import Category from "../models/Category.js";
import Products from "../models/Product.js";
import { productValidation } from "../validations/product.js";

export const getList = async (req, res, next) => {
  try {
    const {
      _page = 1,
      _limit = 10,
      _sort = "createAt",
      _order = "asc",
    } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === "asc" ? 1 : -1,
      },
    };
    const data = await Products.paginate({}, options);
    console.log(data);
    if (data) {
      return res.status(200).json({
        message: "Tìm thấy sản phẩm",
        data,
      });
    }
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
