import { User } from "../models/User.js";
import jwt from "jsonwebtoken"; // Fixed import
import bcrypt from "bcrypt"; // Added bcrypt import (make sure this is installed)

export const login = async (req, res) => {
    try {
        const { employeeCode, password, role, subsidiary } = req.body;
        
        // 1. Find user by employeeCode (not id)
        const user = await User.findOne({ employeeCode });
        
        // 2. If user doesn't exist, RETURN immediately
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Unauthorized personnel"
            });
        }
        
        // 3. Now safely check the password (outside the !user block)
        const Checkpass = await bcrypt.compare(password, user.password);
        if (!Checkpass) {
            return res.status(401).send({
                success: false,
                message: "Wrong Password"
            });
        }
        
        // 4. Generate token (Fixed typo)
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        
        // 5. Send success response
        return res.status(200).send({
            success: true,
            message: "Login successful",
            token: token,
            role: user.role
        });
        
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "Sign in nii hora hai",
            error: err.message
        });
    }
}