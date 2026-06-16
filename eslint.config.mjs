import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", ".tools/**", ".npm-cache/**"]
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;
