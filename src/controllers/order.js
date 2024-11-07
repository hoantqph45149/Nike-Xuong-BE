import Order from "../models/Order.js";

export const getOrders = async (req, res, next) => {
  try {
    const order = await Order.find();
    res.json(order);
  } catch (error) {
    next(error);
  }
};
export const getOrderByUserId = async (req, res, next) => {
  try {
    const order = await Order.find({ userId: req.user._id }).populate(
      "products.product"
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOderbyId = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const RemoveOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
export const searchOrders = async (req, res, next) => {
  try {
    let { q } = req.query;
    // console.log("Tìm kiếm với từ khóa:", q);

    // Loại bỏ ký tự xuống dòng và khoảng trắng
    q = q.trim().replace(/\n/g, ""); // Loại bỏ xuống dòng

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp từ khóa tìm kiếm.",
      });
    }

    const qRegex = new RegExp(q, "i");
    const query = {
      $or: [{ name: qRegex }, { phone: qRegex }, { address: qRegex }],
    };

    // console.log("Query MongoDB:", query);

    const orders = await Order.find(query);
    // console.log("Đơn hàng tìm thấy:", orders);

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào.",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm đơn hàng:", error);
    next(error);
  }
};
