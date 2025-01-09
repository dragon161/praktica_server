const User = require('../models/user');

const updateUser = async (req, res) => {
    try {
         const {id} = req.user;
        const { name, email, password } = req.body;

         const updatedUser = await User.findByIdAndUpdate(id, {name, email, password}, {new: true}).select('-password');

        if (!updatedUser) {
            return res.status(404).send({ error: 'Пользователь не найден' });
        }
        res.send(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ошибка при обновлении данных пользователя' });
    }
};

const getUserAchievements = async (req, res) => {
    try {
        const { userId } = req.params
        const achievements = await Achievement.find({ userId });
        res.send(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ошибка при получении достижений пользователя' });
    }
};

const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params
        const ratings = await Rating.find({ userId })
        .populate('achievementId', 'name description')
        res.send(ratings);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ошибка при получении оценок пользователя' });
    }
};


const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.user
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ error: 'Пользователь не найден' });
        }
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
};

const getUser = async (req, res, next) => {
    try {
        const {id} = req.user
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).send({ error: 'Пользователь не найден' });
        }
        res.send(user);
    } catch (error) {
       next(error);
    }
};

module.exports = { updateUser,getUserAchievements, getUserRatings, deleteUser, getUser };