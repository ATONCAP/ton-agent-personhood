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
  
  // Module resolution (fixed typo: was moduleNameMapping)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
  },
  
  // Transform files - use ts-jest from frontend node_modules
  transform: {
    '^.+\\.(ts|tsx)$': ['<rootDir>/frontend/node_modules/ts-jest', {
      tsconfig: '<rootDir>/frontend/tsconfig.json'
    }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage settings
  collectCoverage: false, // Disable initially to focus on getting tests running
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/frontend/node_modules/',
    '<rootDir>/frontend/.next/',
  ],
  
  // Module paths
  modulePaths: ['<rootDir>/frontend/node_modules'],
  
  // Verbose output
  verbose: true,
  
  // TODO: Add integration test configuration once contracts work
  // TODO: Add browser environment tests for frontend components
  // TODO: Add contract testing once FunC compilation is fixed
};
