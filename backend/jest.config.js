module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@test-fixture/(.*)$': '<rootDir>/test-fixture/$1'
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/test/**/*.test.ts']
};
