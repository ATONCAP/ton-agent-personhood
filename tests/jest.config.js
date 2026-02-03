// REAL Jest configuration for testing validation and other utilities

const path = require('path');

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Root directory for tests
  rootDir: '../',
  
  // Test files pattern
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  
  // Module resolution
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
  },
  
  // TypeScript support
  preset: 'ts-jest',
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage settings
  collectCoverage: true,
  coverageDirectory: '<rootDir>/tests/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'frontend/src/**/*.{ts,tsx}',
    '!frontend/src/**/*.d.ts',
    '!frontend/src/**/node_modules/**',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/frontend/node_modules/',
    '<rootDir>/frontend/.next/',
  ],
  
  // Verbose output
  verbose: true,
  
  // TODO: Add integration test configuration once contracts work
  // TODO: Add browser environment tests for frontend components
  // TODO: Add contract testing once FunC compilation is fixed
};
