module.exports = {
  extends: ["@recidiviz"],
  plugins: ["header"],
  rules: {
    "header/header": [2, "../license-header.js"],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
