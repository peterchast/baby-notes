// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {


  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat('DDDD @ t');
  });

  // A handy markdown shortcode for blocks of markdown
  // coming from our data sources
  const markdownIt = require('markdown-it');
  const md = new markdownIt({
    html: true
  });
  eleventyConfig.addPairedShortcode('markdown', (content) => {
    return md.render(content);
  });


  // Simply inline minified CSS
  const CleanCSS = require('clean-css');
  eleventyConfig.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  });


  // Where are my things?
  return  {
    dir: {
      input: "src",
      output: "dist"
    }
  };

};
