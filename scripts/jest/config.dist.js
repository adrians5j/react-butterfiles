const baseConfig = require("./config.base");

// Create a module map to point packages to the build output
const moduleNameMapper = {};

moduleNameMapper["^react-butterfiles/(.*)$"] = "<rootDir>dist/$1";
moduleNameMapper["^react-butterfiles$"] = "<rootDir>dist";

module.exports = Object.assign({}, baseConfig, {
    moduleNameMapper
});
