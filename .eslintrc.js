module.exports = {
  extends: ["@recidiviz", "react-app/jest", "plugin:storybook/recommended"],
  plugins: ["header"],
  rules: {
    "header/header": [2, "../license-header.js"],
    "prettier/prettier": "off",
  },
};
