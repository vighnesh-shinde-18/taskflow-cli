import db from '../db/index.js'
import { hashPassword, checkPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, teamId } = req.body;
 
    if ([name, email, password, role].some(field => !field?.trim())) {
        throw new ApiError(400, 'All fields are required');
    }
 
    const [existingUser] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existingUser.length > 0) {
        throw new ApiError(409, 'User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
 
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    );

    const userId = result.insertId;
 
    if (role === 'MANAGER') {
        await db.execute(
            'INSERT INTO teams (name, manager_id) VALUES (?, ?)',
            [`${name}'s Team`, userId]
        );
    }

    // 5. Developer Logic: assign to team
    if (role === 'DEVELOPER') {
        if (!teamId) {
            throw new ApiError(400, 'teamId is required for developer role');
        }

        const [teams] = await db.execute('SELECT id FROM teams WHERE id = ?', [teamId]);
        if (!teams.length) {
            throw new ApiError(404, 'The assigned team does not exist');
        }

        await db.execute(
            'INSERT INTO team_members (team_id, developer_id) VALUES (?, ?)',
            [teamId, userId]
        );
    }

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { userId, name, email, role }
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

      if ([ email, password].some(field => !field?.trim())) {
        throw new ApiError(400, 'All fields are required');
    }
  
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    // Check if user exists
    if (!rows.length) {
        throw new ApiError(401, "Invalid email"); 
        // Note: Using a generic message is more secure for production
    }

    const user = rows[0];
    const isMatch = await checkPassword(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid password");
    }

    const token = await generateToken({
        id: user.id,
        role: user.role,
        name: user.name
    });

    res.status(200).json({ 
        success: true, 
        message: "User login successful", 
        data: {
            token,
            user: { id: user.id, name: user.name, role: user.role }
        } 
    });
});

export { registerUser, loginUser };