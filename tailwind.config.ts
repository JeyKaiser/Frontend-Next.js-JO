//archivo encargado de la configuración de Tailwind CSS
//exporta la configuración de Tailwind CSS para la aplicación
//tailwind.config.ts

import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    aspectRatio,
  ],
};
