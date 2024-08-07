module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.tsx', './src/**/*.ts'],
  variants: {},
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['emerald', 'dark'],
  },
}
