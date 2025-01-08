const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementsByUser,
    getAllAchievements,
    rateAchievement,
    getAverageRating
} = require('../controllers/contentController');
const router = express.Router();


router.post('/', authenticate, addAchievement);
router.patch('/:id', authenticate, updateAchievement);
router.delete('/:id', authenticate, deleteAchievement);
router.get('/me', authenticate, getAchievementsByUser);
router.get('/',  getAllAchievements);
router.post('/rate', authenticate, rateAchievement);
router.get('/:id/rating', getAverageRating);

module.exports = router;