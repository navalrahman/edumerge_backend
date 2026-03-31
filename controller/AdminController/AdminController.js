const User = require('../../models/Admin')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
require('dotenv').config();

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '1d' })
}

const signup = async (req, res) => {
    const { name, email, emailOrMobile, password, role } = req.body;
    const userEmail = emailOrMobile || email;

    try {
        const user = await User.signup(name, userEmail, password, role);
        const token = createToken(user._id, user.role);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ name, email: userEmail, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const login = async (req, res) => {
    const { emailOrMobile, email, password } = req.body;
    const userEmail = emailOrMobile || email;

    try {
        const user = await User.login(userEmail, password)
        const token = createToken(user._id, user.role)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ name: user.name, email: userEmail, role: user.role })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { signup, login }