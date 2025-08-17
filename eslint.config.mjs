import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: {
      ...globals.browser,
      Car: "readonly",
      ANN: "readonly",
      Sensor: "readonly",
      Visualizer: "readonly",
      Controls: "readonly",
      Road: "readonly",
      lerp: "readonly",
      getIntersection: "readonly",
      checkPolysIntersect: "readonly",
      getRGBA: "readonly",
      getRandomColor: "readonly",
      TRAFFIC_DATA: "readonly"
    }
     },
    rules: {
      "no-unused-vars": "warn",           // unused variables
      "no-console": "off",                // console.log in dev mode
      "semi": ["error", "always"],        // mandatory semi colons
      "eqeqeq": ["error", "always"]       // use === over ==
    }
  },

]);
