const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/config');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
  }

  try {
      const decoded = jwt.verify(token, jwtSecret);

      const user = await User.findById(decoded.userId);
      
      if (!user) {
          return res.status(401).json({ message: 'Неверный токен, авторизация отклонена' });
      }
      req.user = user;
      next();

  } catch (error) {

    return res.status(401).json({ message: 'Неверный токен, авторизация отклонена' });
  }
};

module.exports = { authenticate };