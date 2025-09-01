/** 共通の Tailwind 設定。アプリ側で `presets: [require('@event-games/tailwind-config')]` として利用します。 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};
