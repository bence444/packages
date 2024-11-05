/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './projects/components/src/lib/**/*.{html,ts}',
    './projects/web-test/src/**/*.{html,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(.light *) }',
      '&:is(.dark *)',
    ]
  ]
}

