require("dotenv").config();

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginPWA = require("eleventy-plugin-pwa");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventy) {
  eleventy.addPassthroughCopy({ assets: "." });

  eleventy.addPlugin(pluginRss);
  eleventy.addPlugin(pluginPWA, {
    swDest: "./_site/sw.js",
    globDirectory: "./_site",
  });
  eleventy.addPlugin(syntaxHighlightPlugin);

  eleventy.addShortcode("tags", require("./config/shortcodes/tags"));
  eleventy.addShortcode("excerpt", require("./config/shortcodes/excerpt"));
  eleventy.addShortcode(
    "readingTime",
    require("./config/shortcodes/read-time")
  );
  eleventy.addShortcode(
    "formatDate",
    require("./config/shortcodes/format-date")
  );
  eleventy.addShortcode("author", require("./config/shortcodes/author"));

  eleventy.addFilter("head", require("./config/filters/head"));

  eleventy.addCollection("starred", require("./config/collections/likes"));
  eleventy.addCollection("post", async function (collections) {
    const [collection] = await Promise.all([
      require("./config/collections/webmentions")(collections),
      require("./config/collections/addPrevAndNext")(collections),
      require("./config/collections/social-cards")(collections),
    ]);

    return collection;
  });

  require("./config/minify")(eleventy);
};
