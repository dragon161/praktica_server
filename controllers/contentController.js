const Achievement = require('../models/achievement'); // Объявляем Achievement 1 раз

const User = require('../models/user');
const Rating = require('../models/rating');


const addAchievement = async (req, res, next) => {
  console.log('Запрос на создание достижения:', req.body);
  try {
    const { title, description, images } = req.body;
     const newAchievement = await Achievement.create({
        userId: req.user.id,
         title,
         description,
         images
      });
      res.status(201).send(newAchievement);
    } catch (error) {
      console.error('Ошибка при создании достижения:', error);
     next(error);
  }
};
const updateAchievement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, images } = req.body;
        const updatedAchievement = await Achievement.findByIdAndUpdate(
            id,
            { title, description, images },
             { new: true }
        );
       if (!updatedAchievement) {
           return res.status(404).send({ error: 'Достижение не найдено' });
       }
        res.send(updatedAchievement);
   } catch (error) {
        console.error('Ошибка при обновлении достижения:', error);
        next(error);
    }
};

const deleteAchievement = async (req, res, next) => {
    try {
       const { id } = req.params;
      const deletedAchievement = await Achievement.findByIdAndDelete(id);
       if (!deletedAchievement) {
            return res.status(404).send({ error: 'Достижение не найдено' });
        }
       res.sendStatus(204);
    } catch (error) {
        console.error('Ошибка при удалении достижения:', error);
        next(error);
  }
};
const getAchievementsByUser = async (req, res, next) => {
    try {
        const userId  = req.user.id;
        const achievements = await Achievement.find({ userId });
        res.send(achievements);
  } catch (error) {
       console.error('Ошибка при получении достижений пользователя:', error);
        next(error);
    }
};

const getAllAchievements = async (req, res, next) => {
    try {
        const achievements = await Achievement.find();
        res.send(achievements);
   } catch (error) {
        console.error('Ошибка при получении всех достижений:', error);
        next(error);
    }
};

const rateAchievement = async (req, res, next) => {
  try {
    const { achievementId, rating } = req.body;
    const newRating = await Rating.create({
        userId: req.user.id,
         achievementId,
        rating
    })
     res.status(201).send(newRating);
   } catch (error) {
        console.error('Ошибка при создании оценки:', error);
        next(error);
   }
}
const getAverageRating = async (req, res, next) => {
  try {
      const { id } = req.params
     const ratings = await Rating.find({ achievementId: id });
     if (ratings.length === 0) {
       return res.send({ averageRating: 0})
    }
      const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
       const averageRating = totalRating / ratings.length;
       res.send({averageRating});
   } catch (error) {
        console.error('Ошибка при получении средней оценки:', error);
        next(error);
    }
}

module.exports = {
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementsByUser,
    getAllAchievements,
    rateAchievement,
     getAverageRating
};