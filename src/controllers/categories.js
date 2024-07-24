import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { categoryValidation } from "../validations/category.js";
import slugify from "slugify";

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find().populate("products");
    if (!categories) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json({
      message: "Lấy danh mục thành công",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getOneCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json({
      message: "Lấy danh mục thành công",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name, {
      replacement: "-",
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    });
    const category = await Category.create({ ...req.body, slug });
    if (!category) {
      return res.status(404).json({
        message: "Tạo danh mục không thành công",
      });
    }
    return res.status(201).json({
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    next();
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({
        message: "Cập nhật danh mục không thành công",
      });
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: category,
    });
  } catch (error) {
    next();
  }
};

export const removeCategory = async (req, res, next) => {
  try {
    if (req.params.id === "66a08e5cea539f8e97274fc6") {
      return res.status(400).json({
        message: "không xóa được danh mục mặc định",
      });
    }
    const data = await Category.findByIdAndDelete(req.params.id);

    const productToUpdate = await Product.find({ categoryId: req.params.id });
    await Promise.all(
      productToUpdate.map(async (product) => {
        product.categoryId = "66a08e5cea539f8e97274fc6";
        await product.save();
      })
    );
    if (data) {
      return res.status(200).json({
        message: "xóa danh mục thành công",
        data,
      });
    }
  } catch (error) {
    next();
  }
};
