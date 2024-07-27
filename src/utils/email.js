import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { EMAIL, PASSWORD_EMAIL } = process.env;
export const senEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD_EMAIL,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Thay đổi mật khẩu",
      text: `Mật khẩu của bạn đã được thiết lập lại. mật khẩu mới của bạn là : ${password}`,
      html: `<p>Mật khẩu của bạn đã được thiết lập lại.</p><p>mật khẩu mới của bạn là: <strong>${password}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};
