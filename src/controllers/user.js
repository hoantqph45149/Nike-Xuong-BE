import User from "../models/User.js";

export const showProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      return res.status(200).json({
        user,
      });
    }
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(400).json({
          message: "Cập nhật thất bại",
        });
      }
      return res.status(200).json({
        message: "Cập nhật thành công",
        data: user,
      });
    } else {
      return res.status(401).json({
        message: "Người dùng không hợp lệ",
      });
    }
  } catch (error) {
    next(error);
  }
};
