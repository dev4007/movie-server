const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(201).json({ success: true, token });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(404).json({ success: false, error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ success: true, token });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { register, login };
