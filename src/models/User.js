import mogoose from "mongoose";

const userSchema = new mogoose.Schema(
  {
    usename: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      default: "member",
      enum: ["member", "admin"],
    },
  },
  { timestamps: true, versionKey: false }
);
const User = mogoose.model("User", userSchema);
export default User;
