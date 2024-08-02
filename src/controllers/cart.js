import Cart from "../models/Cart.js";
import Product from "./../models/Product.js";
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [], totalAmount: 0 });
    }

    const findIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );
    if (findIndex === -1) {
      cart.products.push({ product, quantity });
    } else {
      cart.products[findIndex].quantity += quantity;
    }
    cart.totalAmount += product.price * quantity;
    await cart.save();
    return res.status(200).json({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFormCart = async (req, res, next) => {
  try {
    const idUser = req.user._id;
    const { productId } = req.body;
    const product = await Product.findById(productId);
    let cart = await Cart.findOne({ userId: idUser });
    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }
    const findIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );
    if (findIndex === -1) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }
    const productCart = cart.products[findIndex];
    cart.totalAmount -= productCart.quantity * product.price;
    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId.toString()
    );
    await cart.save();
    return res.status(200).json({
      message: "Xoá sản phẩm khỏi giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }
  } catch (error) {
    next(error);
  }
};
