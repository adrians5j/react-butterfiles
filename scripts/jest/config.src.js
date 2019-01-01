const baseConfig = require("./config.base");

// Create a module map to point packages to the build output
const moduleNameMapper = {};

moduleNameMapper["^react-butterfiles/(.*)$"] = "<rootDir>src/$1";
moduleNameMapper["^react-butterfiles$"] = "<rootDir>src";

module.exports = Object.assign({}, baseConfig, {
    moduleNameMapper,
    coverageReporters: ["lcov", "html"],
    coveragePathIgnorePatterns: ["__tests__", "/node_modules/"]
});
