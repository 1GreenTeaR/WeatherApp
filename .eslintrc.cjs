// Need to use full paths. Relative paths break if you open any project separately.
const path = require("path");

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: [path.resolve(__dirname, "./tsconfig.json")],
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",

    // Enables eslint-plugin-prettier and eslint-config-prettier.
    // This will display prettier errors as ESLint errors.
    // Make sure this is always the last configuration in the extends array.
    "plugin:prettier/recommended",
    "plugin:import/recommended",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".mts", ".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: true,
      node: true,
      typescript: {
        project: [path.resolve(__dirname, "./tsconfig.json")],
      },
    },
  },
  env: {
    browser: true,
    es2022: true,
  },
  globals: {
    NodeJS: false,
    JSX: false,
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    "linebreak-style": ["error", "unix"],
    "max-len": [
      "error",
      { code: 160, tabWidth: 4, ignoreComments: true, ignoreStrings: true },
    ],
    "no-undef": "off",
    "react/jsx-curly-brace-presence": [2, "never"],
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
    "@typescript-eslint/no-unused-vars": "off",
    "eol-last": ["error", "always"],
    eqeqeq: "error",
    quotes: ["error", "single", { avoidEscape: true }],
  },
  overrides: [
    {
      files: ["**/*.mts"],
      rules: {
        "max-len": [
          "error",
          {
            code: 160,
            ignorePattern: "^import\\s",
            ignoreComments: true,
            ignoreStrings: true,
          },
        ],
      },
    },
  ],
  ignorePatterns: [".eslintrc.*", "dist", "node_modules"],
};
