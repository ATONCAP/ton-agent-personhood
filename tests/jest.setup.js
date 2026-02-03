// Jest setup file - run before each test file

// Global test setup
global.console = {
  ...console,
  // Suppress console.warn during tests for cleaner output
  warn: jest.fn(),
};

// TODO: Add global mocks here when needed
// TODO: Add test database setup once real contracts exist
// TODO: Add blockchain test environment setup

console.log('🧪 Jest test environment initialized');
