// jest.config.js
export default {
    testEnvironment: "node",
    // Clear mock state between each test
    clearMocks: true,
    // Run all test suites sequentially in a single process.
    // This is required because all suites share the same real MongoDB test database.
    // Parallel workers would race on beforeEach cleanup, causing intermittent failures.
    // maxWorkers: 1 is the jest.config.js equivalent of the --runInBand CLI flag.
    maxWorkers: 1,
};
