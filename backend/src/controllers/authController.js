import { User } from "../models/User.js";
import { LoginLog } from "../models/LoginLog.js";
import { config } from "../config/index.js";
import jwt from "jsonwebtoken";

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign(
    { id: user._id.toString(), employeeCode: user.employeeCode, role: user.role },
    config.jwtSecret || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  // Remove password from output
  const userData = user.toObject();
  delete userData.password;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      data: userData,
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, employeeCode, password, role, id } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      employeeCode,
      password,
      role,
      id: id || employeeCode, // fallback for custom id
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  
  try {
    const { employeeCode, password, role, subsidiary } = req.body;

    if (!employeeCode || !password) {
      await LoginLog.create({
        email: employeeCode,
        status: "FAILED",
        failureReason: "Missing credentials",
        ipAddress,
        userAgent,
      });
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check for user
    const user = await User.findOne({ employeeCode }).select("+password");

    if (!user) {
      await LoginLog.create({
        email: employeeCode,
        status: "FAILED",
        failureReason: "User not found",
        ipAddress,
        userAgent,
      });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await LoginLog.create({
        userId: user._id,
        email: employeeCode,
        status: "FAILED",
        failureReason: "Incorrect password",
        ipAddress,
        userAgent,
      });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Log success
    await LoginLog.create({
      userId: user._id,
      email: employeeCode,
      status: "SUCCESS",
      ipAddress,
      userAgent,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is already populated by authMiddleware via User.findById(decoded.id)
    const user = req.user;
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};