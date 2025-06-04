/**
 * @type {jest.ProjectConfig}
 */
module.exports = {
  roots: ["<rootDir>/test"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        jsx: "react",
        target: "es2018",
        lib: ["dom", "es2018"],
        types: ["jest", "@testing-library/jest-dom"],
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
