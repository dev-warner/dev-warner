const fs = require("fs");
const axios = require("axios");
const unionBy = require("lodash/unionBy");

const ROOT = process.env.URL + "/";

const isProduction = process.env.NODE_ENV === "production";
const url = new URL(ROOT);

const API = "https://webmention.io/api";
const CACHE_FILE_PATH = "_cache/webmentions.json";
const TOKEN = process.env.WEBMENTION_IO_TOKEN;

async function fetchWebmentions(lastFetched) {
  if (!url.hostname || !TOKEN) {
    throw new Error("@webmentions: can't fetch mentions");
  }

  const webmentionLink = `${API}/mentions.jf2`;

  const { data } = await axios.get(webmentionLink, {
    params: { domain: url.hostname, token: TOKEN, lastFetched },
  });

  return data;
}

function readFromCache() {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    const cacheFile = fs.readFileSync(CACHE_FILE_PATH);

    return JSON.parse(cacheFile);
  }
  return {
    lastFetched: null,
    children: [],
  };
}

function mergeWebmentions(a, b) {
  return unionBy(a.children, b.children, "wm-id");
}

function writeToCache(data) {
  const dir = "_cache";
  const fileContent = JSON.stringify(data, null, 2);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(CACHE_FILE_PATH, fileContent, (err) => {
    if (err) throw err;

    console.log(`@webmentions: cached to ${CACHE_FILE_PATH}`);
  });
}

const getWebMentions = async () => {
  console.log("@webmentions: fetching web mentions");

  let cache;

  try {
    cache = readFromCache();
    if (cache && cache.children.length) {
      console.log(
        `@webmentions: previously fetched webmentions: ${cache.children.length}`
      );
    }
  } catch (err) {
    cache = {
      children: [],
      lastFetched: null,
    };
  }

  if (
    (isProduction || !cache.children.length) &&
    process.env.NODE_ENV !== "staging"
  ) {
    console.log("@webmentions: checking for new webmentions");

    const feed = await fetchWebmentions(cache.lastFetched);

    if (feed) {
      const webmentions = {
        lastFetched: new Date().toISOString(),
        children: mergeWebmentions(cache, feed),
      };

      writeToCache(webmentions);

      return webmentions;
    }
  }

  return cache;
};

function getWebmention(url, webmentions) {
  return webmentions.filter((mention) => {
    const target = new URL(mention["wm-target"]);

    return target.pathname === url;
  });
}

const TYPES = {
  "like-of": "likes",
  "in-reply-to": "replies",
  "mention-of": "replies",
};

class MentionModel {
  constructor({ author, url, published, content }) {
    this.author = author;
    this.url = url;
    this.published = published;

    if (content) {
      this.content = content.text;
    }
  }
}

module.exports = async function addWebMentions(collection) {
  const coll = collection.getFilteredByTag("post");
  const webmentions = await getWebMentions();

  return coll.map((post) => {
    const mentions = getWebmention(post.url, webmentions.children);

    Object.assign(post.data, {
      webmention: {
        likes: [],
        replies: [],
      },
    });

    if (mentions) {
      mentions.forEach((mention) => {
        const type = TYPES[mention["wm-property"]];
        const model = new MentionModel(mention);
        const other = post.data.webmention[type];

        post.data.webmention[type] = [...other, model];
      });
    }

    return post;
  });
};
