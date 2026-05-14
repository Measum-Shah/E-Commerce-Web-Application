import { registerUser, loginUser } from "../services/auth.service.js";

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

export { register, login, me };