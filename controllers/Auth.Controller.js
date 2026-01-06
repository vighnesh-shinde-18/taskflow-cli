import db from '../db/index.js'
import { hashPassword, checkPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const registerUser = asyncHandler(async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        if ([name, email, password, role].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const hasedPassword = await hashPassword(password);


        const [result] = await db.execute(
            'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
            [name, email, hasedPassword, role]
        )

        res.status(201).json({ message: "User register successfully", data: result, success: true })
    } catch (error) {
        console.log("Error while registring user ", error)
        throw new ApiError(503, "Internel Server error", error);
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {

        const { email, password } = req.body;

        if ([email, password].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (!rows.length) {
            throw new ApiError(401, "Invalid Email")
        }

        const user = rows[0];
        const isMatch = await checkPassword(password, user.password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid Password")
        }

        const token = await generateToken({
            id: user.id,
            role: user.role,
            name: user.name
        });

        res.status(200).json({ message: "User Login successfully", data: token, success: true })

    } catch (error) {
        console.log("Error while logining user ", error)
        throw new ApiError(503, "Internel Server error", error);
    }
})

export { registerUser, loginUser }