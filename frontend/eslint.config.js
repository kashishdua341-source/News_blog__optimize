import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
export default [
  js.configs.recommended,
  { files: ["**/*.{js,jsx}"], languageOptions: { globals: { window: "readonly", document: "readonly", console: "readonly", fetch: "readonly" }, parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } } }, plugins: { "react-hooks": reactHooks }, rules: { ...reactHooks.configs.recommended.rules, "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }] } }
];
