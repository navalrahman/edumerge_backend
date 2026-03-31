const jwt = require('jsonwebtoken')
const User = require('../models/Admin')
const dotenv = require('dotenv')
require('dotenv').config()

const requireAuth = async (req, res, next) => {
    let token;

    // Check if token exists in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // Fallback to Bearer token in headers
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({ _id: decoded._id }).select('_id role')
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send("Invalid Token");
    }
}

module.exports = requireAuth