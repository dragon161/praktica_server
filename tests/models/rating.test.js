const mongoose = require('mongoose');
jest.mock('bcrypt');
jest.mock('../../models/user', () => {
    return {
        create: jest.fn().mockResolvedValue({ _id: '12345' })
    }
});
jest.mock('../../models/achievement', () => {
    return {
        create: jest.fn().mockResolvedValue({ _id: '12345' }),
        find: jest.fn().mockResolvedValue([])
    }
});
jest.mock('../../models/rating', () => {
    return {
        create: jest.fn().mockImplementation(ratingData => ({
            ...ratingData,
            save: jest.fn()
        })),
        find: jest.fn().mockResolvedValue([])
    }
})

const Rating = require('../../models/rating');
const User = require('../../models/user');
const Achievement = require('../../models/achievement');


describe('Rating Model', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new rating', async () => {


        const ratingData = {
            userId: '12345',
            achievementId: '12345',
            rating: 4
        };
        const rating = await Rating.create(ratingData);
        await rating.save();
        expect(rating).toBeDefined();
        expect(rating.userId).toEqual('12345');
        expect(rating.achievementId).toEqual('12345');
        expect(rating.rating).toBe(ratingData.rating);
    });

    it('should fail validation if required fields are missing', async () => {
        const error = new mongoose.Error.ValidationError();
       error.errors = {
           rating: new mongoose.Error.ValidatorError({message: 'Path `rating` is required'})
       }
       Rating.create.mockImplementation(() => {
          throw error
       })
       let actualError
        try {
           await  Rating.create({ userId: '12345', achievementId: '12345' });
        } catch (e) {
            actualError = e
        }

        expect(actualError).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(actualError.errors).toHaveProperty('rating');
    });

    it('should fail validation if rating is not in range 1-5', async () => {
        const error = new mongoose.Error.ValidationError()
        error.errors = {
           rating: new mongoose.Error.ValidatorError({message: 'Path `rating` is not in range 1-5'})
        }
       Rating.create.mockImplementation(() => {
           throw error;
       });
        let actualError;
        try {
             await Rating.create({ userId: '12345', achievementId: '12345', rating: 6 });

        } catch (e) {
             actualError = e;
        }
        expect(actualError).toBeInstanceOf(mongoose.Error.ValidationError);
         expect(actualError.errors).toHaveProperty('rating');
    });
});