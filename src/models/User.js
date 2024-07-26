import mogoose from "mongoose";

const userSchema = new mogoose.Schema(
  {
    username: {
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
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
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
