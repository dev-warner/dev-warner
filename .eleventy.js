require("dotenv").config();

const minify = require("./config/minify");

const { head } = require("./config/filters");
const shortcodes = require("./config/shortcodes");
const {
  addPrevAndNext,
  addWebMentions,
  addLikes,
} = require("./config/collections");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventy) {
  eleventy.addPassthroughCopy({ assets: "." });

  eleventy.addPlugin(pluginRss);
  eleventy.addPlugin(syntaxHighlightPlugin);

  eleventy.addShortcode("tags", shortcodes.tags);
  eleventy.addShortcode("excerpt", shortcodes.excerpt);
  eleventy.addShortcode("readingTime", shortcodes.readingTime);
  eleventy.addShortcode("formatDate", shortcodes.formatDate);
  eleventy.addShortcode("author", shortcodes.author);

  eleventy.addFilter("head", head);

  eleventy.addCollection("starred", addLikes);
  eleventy.addCollection("post", async function (collections) {
    const [_, collection] = await Promise.all([
      addPrevAndNext(collections),
      addWebMentions(collections),
    ]);

    return collection;
  });

  minify(eleventy);
};
