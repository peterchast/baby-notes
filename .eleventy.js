// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");
const UglifyJS = require("uglify-js");
const Image = require('@11ty/eleventy-img');
Image.concurrency = 1000; // default is 10

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["avif", "jpeg"],
    urlPath: "static/img/",
		outputDir: "static/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);


  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat('DDD - ');
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

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/font");


  // Where are my things?
  return  {
    dir: {
      input: "src",
      output: "dist"
    }
  };

};
