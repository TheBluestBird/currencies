module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/test/mocks/fileMock.ts',
        '\\.(css|less)$': '<rootDir>/test/mocks/styleMock.ts',
        "^components(.*)$": "<rootDir>/src/components$1"
    },
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**', '!**/vendor/**', '!**/dist/**'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
};