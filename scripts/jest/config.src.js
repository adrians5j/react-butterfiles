const baseConfig = require("./config.base");

// Create a module map to point packages to the build output
const moduleNameMapper = {};

// const name = "react-butterfiles";
// moduleNameMapper[`^${name}/(.*)$`] = `<rootDir>packages/${name}/src/$1`;
// moduleNameMapper[`^${name}$`] = `<rootDir>packages/${name}/src`;

module.exports = Object.assign({}, baseConfig, {
    moduleNameMapper
});
