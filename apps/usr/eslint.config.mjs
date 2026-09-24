import nextEslintPluginNext from "@next/eslint-plugin-next";
import nx from "@nx/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import baseConfig from "../../eslint.config.mjs";

export default [
    { plugins: { "@next/next": nextEslintPluginNext } },
    ...nx.configs["flat/react-typescript"],
    ...baseConfig,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "react-hooks": reactHooks
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn"
        }
    },
    {
        ignores: [
            ".next/**/*",
            "**/out-tsc"
        ]
    },
    {
        files: ["src/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["./*", "../*"],
                            message: "Use path aliases (@/…) instead of relative imports."
                        }
                    ]
                }
            ]
        }
    }
];
