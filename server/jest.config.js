module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./tests/setup/index.js",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
