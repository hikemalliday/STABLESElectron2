module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit/eslint-config-ts/recommended",
    // commenting this out fixes linter problems for some reason
    // "@electron-toolkit/eslint-config-prettier",
  ],
};
