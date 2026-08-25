import { User } from "../models/User";



import jwt from "jsonwebtoken";
i

export const login = async (req, res) => {
    try {
        const { employeeCode, password, role, subsidiary } = req.body;
        const user = await User.findOne({ id });
        if (!user) {
            res.status(400).send({
                success: false,
                message: "Unauthorized personell"
            })
            const Checkpass = await bcrypt.compare(password, user.password)
            if (!Checkpass) {
                return res.status(401).send({
                    message: "Wrong Password"
                });
            }
            const token = jwt.signjwt.sign(
            { id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        }
        )
        res.status(200).send({
            message: "Login successful",
            token: token,
            role: user.role
        })
        }
    } catch (err) {
        res.status(400).send({
            message: "Sign in nii hora hai",
            error: err.message
        });
    }
}