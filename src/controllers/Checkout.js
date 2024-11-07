import Cart from "../models/Cart.js";
import Order from "./../models/Order.js";
import dotenv from "dotenv";

const handlePayment = async (amount, ip) => {
  try {
    const paymentUrl = await getTokenVnPay(amount, ip);
    return paymentUrl;
  } catch (error) {
    console.error("Error in handlePayment:", error);
  }
};

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, address, phone, note, payment } = req.body;
    const cart = await Cart.findOne({ userId }).populate("products.product");
    if (!cart) return res.status(400).json({ message: "Cart is empty" });

    switch (payment) {
      case "vnpay":
        const token = await handlePayment(cart.totalAmount, req.ip);
        if (!token)
          return res
            .status(500)
            .json({ message: "Failed to generate VNPay token" });
        return res.status(200).json({ url: token });
      case "paypal":
        break;
      case "stripe":
        break;
      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }
    console.log(userId);
    const order = new Order({
      userId: userId,
      products: cart.products,
      totalAmount: cart.totalAmount,
      name,
      address,
      phone,
      note,
      payment,
    });
    await order.save();
    // Xoá giỏ hàng sau khi thanh toán
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json({ message: "Checkout successfully" });
  } catch (error) {
    next(error);
  }
};
