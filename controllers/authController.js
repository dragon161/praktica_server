const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        const token = generateToken({userId: user._id});
        res.status(201).json({ token, message: 'Пользователь зарегистрирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Ошибка при регистрации пользователя'});
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }
        const token = generateToken({ userId: user._id });
        res.status(200).json({token, message: 'Пользователь авторизован'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Ошибка авторизации'});
    }
};

module.exports = { register, login };