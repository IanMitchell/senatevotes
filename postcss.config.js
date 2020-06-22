const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    content: ['./components/**/*.js', './pages/**/*.js'],
    defaultExtractor: (content) => {
      // Capture as liberally as possible, including things like `h-(screen-1.5)`
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

      // Capture classes within other delimiters like .block(class="w-1/2") in Pug
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

      return broadMatches.concat(innerMatches);
    },
  },
];

module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
