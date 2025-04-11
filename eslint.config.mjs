import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable unused vars rule
      "@next/next/no-img-element": "off", // Disable the <img> element warning
      "react-hooks/exhaustive-deps": "off", // Disable missing dependencies warning in useEffect
    },
  },
];

export default eslintConfig;
