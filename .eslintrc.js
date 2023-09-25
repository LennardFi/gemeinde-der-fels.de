/** @type {import('eslint').Linter.Config} */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/strict",
        "plugin:@next/next/recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint", "@next/eslint-plugin-next"],
    rules: {
        "@typescript-eslint/explicit-member-accessibility": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
}
