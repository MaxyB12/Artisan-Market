import { jest } from '@jest/globals';

// Prevent actual database connections during tests
jest.mock('./config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue(),
    define: jest.fn().mockReturnValue({})
  }
}));

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});