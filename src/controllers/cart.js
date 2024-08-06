import Cart from "../models/Cart.js";
import Product from "./../models/Product.js";
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [], totalAmount: 0 });
    }

    const findIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString() && p.size === size
    );

    let updatedProduct;
    if (findIndex === -1) {
      updatedProduct = { product: productId, quantity, size };
      cart.products.push(updatedProduct);
    } else {
      cart.products[findIndex].quantity += quantity;
      updatedProduct = cart.products[findIndex];
    }

    cart.totalAmount += product.price * quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId: req.user._id })
      .populate("products.product")
      .exec();

    const populatedProduct = updatedCart.products.find(
      (p) =>
        p.product._id.toString() === productId.toString() && p.size === size
    );

    res.json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { productId, quantity, size, oldSize } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const findIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId && item.size === oldSize
    );
    if (findIndex === -1) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    } else {
      cart.products[findIndex].size = size;
      cart.products[findIndex].quantity = quantity;

      cart.totalAmount = cart.products.reduce((total, item) => {
        return total + item.quantity * product.price;
      }, 0);

      await cart.save(); // Save the updated cart
    }

    const updatedCart = await Cart.findOne({ userId: req.user._id })
      .populate("products.product")
      .exec();

    const populatedProduct = updatedCart.products.find(
      (p) =>
        p.product._id.toString() === productId.toString() && p.size === newSize
    );

    res.json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const idUser = req.user._id;
    const { productId, size } = req.body;

    // Tìm sản phẩm
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId: idUser });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const findIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString() && p.size === size
    );
    if (findIndex === -1) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    // Tính toán tổng số tiền sau khi xóa sản phẩm
    const productCart = cart.products[findIndex];
    cart.totalAmount -= productCart.quantity * product.price;

    // Xóa sản phẩm khỏi giỏ hàng
    cart.products = cart.products.filter(
      (p) => !(p.product.toString() === productId.toString() && p.size === size)
    );

    // Lưu giỏ hàng đã cập nhật
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
