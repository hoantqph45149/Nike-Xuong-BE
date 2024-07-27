import User from "../models/User.js";
import { senEmail } from "../utils/email.js";
import { hasshPassword } from "../utils/password.js";

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy người dùng",
      });
    }
    const newPassword = Math.random().toString(36).slice(-8);
    const hassPassword = hasshPassword(newPassword);
    if (!hassPassword) {
      return res.status(400).json({
        message: "Không thể thay đổi mật khẩu",
      });
    }
    user.password = hassPassword;
    await user.save();
    await senEmail(email, newPassword);
  } catch (error) {
    next(error);
  }
};
