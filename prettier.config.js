/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 4,
  useTabs: false,
  semi: true,
  singleQuote: false,
  printWidth: 120,
  trailingComma: "es5",
};


export default config;
