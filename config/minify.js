const CleanCSS = require("clean-css");

const htmlmin = require("html-minifier");
const Terser = require("terser");

module.exports = (eleventy) => {
  eleventy.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventy.addFilter("jsmin", function (code) {
    if (process.env.ELEVENTY_PRODUCTION) {
      let minified = Terser.minify(code);
      if (minified.error) {
        console.log("Terser error: ", minified.error);
        return code;
      }

      return minified.code;
    }

    return code;
  });

  eleventy.addFilter("cssmin", function (code) {
    if (process.env.ELEVENTY_PRODUCTION) {
      return new CleanCSS({}).minify(code).styles;
    }

    return code;
  });
};
