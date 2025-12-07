import user from "../models/user.js";
import { compareString, createJWT, hashString } from "../utils/index.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!(name || email || password)) {
      return next("Provide Required Fields!");
    }
    const userExist = await user.findOne({ email });
    if (userExist) {
      return next("Email Address already exists. Try Login");
    }
    const hashedPassword = await hashString(password);
    const newUser = await user.create({
      name:name,
      email:email,
      password: hashedPassword,
    });
    newUser.password = undefined;
    const token = createJWT(newUser?._id);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return next("Please Provide User Credentials");
    }
    const user_var = await user.findOne({ email: email }).select("+password");
    if (!user_var) {
      return next("Invalid email or password");
    }
    const isMatch = await compareString(password, user_var?.password);
    if (!isMatch) {
      return next("Invalid email or password");
    }
    user_var.password = undefined;
    const token = createJWT(user_var?._id);
    res.status(201).json({
      success: true,
      message: "Login successfully",
      user: user_var,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: "failed", message: error.message });
  }
};