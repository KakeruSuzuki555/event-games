const colors = require('tailwindcss/colors');

/** 共通の Tailwind 設定。アプリ側で `presets: [require('@event-games/tailwind-config')]` として利用します。 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: colors.indigo,
        accent: colors.teal,
        neutral: colors.slate,
      },
    },
  },
  plugins: [],
};
