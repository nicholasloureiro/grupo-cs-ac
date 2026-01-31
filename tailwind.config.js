/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chocolate-dark': '#4A2C2A',
        'chocolate': '#6B4423',
        'gold': '#D4A853',
        'cream': '#FFF8E7',
        'success': '#2E7D32',
        'error': '#C62828',
      },
    },
  },
  plugins: [],
};
