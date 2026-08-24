
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { employeeCode, password, role, subsidiary } = req.body;

    if (!employeeCode || !password) {
      return res.status(400).json({ error: "Employee Code and Password are required." });
    }

    let user = await User.findOne({ employeeCode });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your EIS No. and Password." });
    }

    // Verify role matches if provided in dropdown (as an extra security check)
    if (role && user.role !== role) {
      return res.status(401).json({ error: "Role mismatch. You are not authorized for the selected role." });
    }

    // Verify subsidiary matches
    if (subsidiary && user.subsidiary !== subsidiary && subsidiary !== "CIL_HQ") {
      return res.status(401).json({ error: "Organization mismatch. You do not belong to the selected subsidiary." });
    }

    // Check password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials. Please verify your EIS No. and Password." });
      }
    } else {
      // In case we haven't seeded a password for this user yet, fallback for dev (remove in prod)
      if (password !== "password123") {
        return res.status(401).json({ error: "Invalid credentials. Please verify your EIS No. and Password." });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, employeeCode: user.employeeCode, role: user.role },
      config.jwtSecret,
      { expiresIn: "8h" }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({ success: true, token, data: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};