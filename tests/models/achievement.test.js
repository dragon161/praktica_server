const mongoose = require('mongoose');
jest.mock('bcrypt');
jest.mock('../../models/user', () => {
    return {
        create: jest.fn().mockResolvedValue({ _id: '12345' })
    }
});
jest.mock('../../models/achievement', () => {
    return {
        create: jest.fn().mockImplementation(achievementData => ({
            ...achievementData,
            save: jest.fn()
        })),
        find: jest.fn().mockResolvedValue([]),
        findById: jest.fn().mockResolvedValue(null),
        findByIdAndDelete: jest.fn().mockResolvedValue(null),
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
        save: jest.fn()
    }
})

const Achievement = require('../../models/achievement');
const User = require('../../models/user');


describe('Achievement Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new achievement', async () => {
        const achievementData = {
            userId: '12345',
            title: 'Test Achievement',
            description: 'Test description',
            images: ['image1.jpg', 'image2.jpg']
        };
        const achievement = await Achievement.create(achievementData);
        await achievement.save()

        expect(achievement).toBeDefined();
        expect(achievement.title).toBe(achievementData.title);
        expect(achievement.description).toBe(achievementData.description);
        expect(achievement.images).toEqual(achievementData.images);
        expect(achievement.userId).toEqual('12345');
    });

    it('should fail validation if required fields are missing', async () => {
        const error = new mongoose.Error.ValidationError()
        error.errors = {
            title: new mongoose.Error.ValidatorError({ message: 'Path `title` is required' })
        }
      Achievement.create.mockImplementation(() => {
          throw error
      })
        let actualError
        try {
           await  Achievement.create({ userId: '12345' });
        } catch (e) {
           actualError = e
        }
        expect(actualError).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(actualError.errors).toHaveProperty('title');
    });
});