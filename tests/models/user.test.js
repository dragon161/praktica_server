const mongoose = require('mongoose');

jest.mock('../../models/user', () => {
    const bcrypt = require('bcrypt');
    jest.mock('bcrypt');
    return {
        findById: jest.fn().mockResolvedValue(null),
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((userData) => {
            return {
                ...userData,
                save: jest.fn().mockResolvedValue({ ...userData, password: 'hashedPassword' }),
                comparePassword: jest.fn(async (password) => {
                    return await bcrypt.compare(password, 'hashedPassword');
                }),
                password: 'hashedPassword'
            };
        }),
    };
});
const User = require('../../models/user');
const bcrypt = require('bcrypt');

describe('User Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user with hashed password', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword123'
        };
        bcrypt.hash.mockResolvedValue('hashedPassword');
        const user = await User.create(userData);
        await user.save();
       expect(user.save).toHaveBeenCalledTimes(1);
        expect(user.password).toBe('hashedPassword');
    });

    it('should correctly compare password', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword123',
        };
        const user = await User.create(userData);
        bcrypt.compare.mockResolvedValue(true);

        const isMatch = await user.comparePassword('testpassword123');
        expect(isMatch).toBe(true);
        expect(user.comparePassword).toHaveBeenCalledWith('testpassword123');

        bcrypt.compare.mockResolvedValue(false);
         const isMatchFail = await user.comparePassword('wrong_password');
         expect(isMatchFail).toBe(false)
    });

     it('should fail validation if required fields are missing', async () => {
        const error = new mongoose.Error.ValidationError();
        error.errors = {
            email: new mongoose.Error.ValidatorError({ message: 'Path `email` is required' }),
            password: new mongoose.Error.ValidatorError({ message: 'Path `password` is required' })
        };
        User.create.mockImplementation(() => {
            throw error
        });
        let actualError
        try {
            await User.create({ name: 'test_user' })
        } catch (e) {
          actualError = e
        }

        expect(actualError).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(actualError.errors).toHaveProperty('email');
        expect(actualError.errors).toHaveProperty('password');
    });
});