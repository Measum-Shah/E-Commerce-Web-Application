import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async ({ fullName, email, phone, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account is disabled");
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
};

export { registerUser, loginUser };