const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, 'tests'),
  testMatch: [
    '<rootDir>/specs/*.(spec|test).(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFiles: ["<rootDir>/setupTests.ts"],
};
