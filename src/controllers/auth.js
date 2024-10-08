import User from "../models/User.js";
import { signInValidation, signUpValidation } from "../validations/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { hasshPassword } from "../utils/password.js";
import { generrateToken } from "../utils/jwtToken.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const signUp = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({
        message: "Email đã được đăng ký",
      });
    }

    const hashedPassword = hasshPassword(req.body.password);
    if (!hashedPassword) {
      return res.status(400).json({
        message: "Mã hóa mật khẩu thất bại",
      });
    }
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    newUser.password = undefined;
    return res.status(200).json({
      message: "Đăng ký thành công",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "Email này chưa được đăng ký",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không đúng",
      });
    }
    const accessToken = generrateToken({ _id: user._id });

    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: {
        user,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
