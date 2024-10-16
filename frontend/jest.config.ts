export {};
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>../shared/src/$1',
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "jest.setup.ts",
    "index.tsx"
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};