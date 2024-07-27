import express from "express";
import { signIn, signUp } from "../controllers/auth.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import { signInValidation, signUpValidation } from "../validations/user.js";
import { showProfile, updateProfile } from "../controllers/user.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { forgotPassword } from "../controllers/forgotPassword.js";

const routerAuth = express.Router();

routerAuth.post("/register", validBodyRequest(signUpValidation), signUp);
routerAuth.post("/login", validBodyRequest(signInValidation), signIn);
routerAuth.post("/forgot-password", forgotPassword);
routerAuth.use("/", checkAuth);
routerAuth.get("/me", showProfile);
routerAuth.patch("/update-me", updateProfile);
export default routerAuth;
