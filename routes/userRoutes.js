const express = require('express');
const {updateUser,getUserAchievements, getUserRatings, deleteUser, getUser} = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/me', authenticate, getUser);
router.patch('/me', authenticate, updateUser);
router.delete('/me', authenticate, deleteUser);
router.get('/:userId/achievements', authenticate, getUserAchievements);
router.get('/:userId/ratings', authenticate, getUserRatings);

module.exports = router;