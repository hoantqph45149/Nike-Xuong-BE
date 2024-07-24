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
