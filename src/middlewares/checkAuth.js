import User from "../models/User.js";
import { verifyToken } from "../utils/jwtToken.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decode = verifyToken(token);
    if (!decode) {
      return res.status(401).json({
        message: "Token invalid",
      });
    }
    const _id = decode._id;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy người dùng",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
