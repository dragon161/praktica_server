const { generateToken } = require('../../utils/jwt');
const { jwtSecret, jwtExpiresIn } = require('../../config/config');
const jwt = require('jsonwebtoken');


describe('JWT Utility', () => {
    it('should generate a valid token', () => {
        const payload = { userId: '12345' };
        const token = generateToken(payload);
        expect(token).toBeDefined();
        const decoded = jwt.verify(token, jwtSecret);
        expect(decoded.userId).toBe(payload.userId);
    });

    it('should generate a token with correct expiration time', () => {
        const payload = { userId: '12345' };
        const token = generateToken(payload);
        const decoded = jwt.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;
        const expectedExpiration = currentTime + parseInt(jwtExpiresIn) * 60 * 60
         expect(expirationTime).toBeGreaterThan(currentTime);
         expect(expirationTime).toBeCloseTo(expectedExpiration, 0);
    });
});