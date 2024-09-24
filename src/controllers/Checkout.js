import Cart from "../models/Cart.js";
import Order from "./../models/Order.js";
import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";
dotenv.config();
const { MERCHANT_CODE, HASH_SECRET, VN_PAY_URL } = process.env;

const getTokenVnPay = async (amount, ip) => {
  try {
    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: MERCHANT_CODE, // Mã của merchant
      vnp_Amount: amount * 100, // Số tiền thanh toán (VND * 100)
      vnp_CurrCode: "VND",
      vnp_TxnRef: crypto.randomBytes(8).toString("hex"), // Mã tham chiếu giao dịch
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_ReturnUrl: "http://localhost:3000/payment/callback",
      vnp_IpAddr: ip, // Địa chỉ IP của client
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .substring(0, 14),
    };

    // Gửi yêu cầu đến VNPay
    const response = await axios.post(
      "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
      vnp_Params,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Kiểm tra phản hồi từ VNPay
    if (response.data && response.data.token) {
      const token = response.data.token;
      // Tạo URL thanh toán từ token
      const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/Transaction/PaymentMethod.html?token=${token}`;
      console.log("Payment URL:", paymentUrl);

      // Trả về URL thanh toán
      return paymentUrl;
    } else {
      console.error("Error: Không nhận được token từ VNPay");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
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
    // Viết thêm logic về thanh toán tuỳ xem chuyển khoản theo phương thức nào hoặc dùng api bên thứ 3.
    switch (payment) {
      case "vnpay":
        const token = handlePayment(cart.totalAmount, req.ip);
        console.log("Token:", token);
        return res.status(200).json({ url: token });
      case "paypal":
        break;
      case "stripe":
        break;
      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }
    const order = new Order({
      user: userId,
      products: cart.products,
      totalAmount: cart.totalAmount,
      name,
      address,
      phone,
      note,
      payment,
    });
    await order.save();

    // Xoa gio hang sau khi thanh toan
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();
    return res.status(200).json({ message: "Checkout successfully" });
  } catch (error) {
    next(error);
  }
};
