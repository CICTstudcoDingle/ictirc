/** @type {import('lint-staged').Configuration} */
export default {
  "*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css,yaml,yml}": ["prettier --write"],
};
