const axios = require("axios");
const fs = require("fs");

const BASE = "https://api.feedbin.com/v2/";
const STARED = `starred_entries.json`;
const ENTRIES = `entries.json`;
const CACHE_FILE_PATH = "_cache/likes.json";
const isProduction = process.env.NODE_ENV === "production";

const http = axios.create({
  baseURL: BASE,
  auth: {
    username: process.env.FEEDBIN_EMAIL,
    password: process.env.FEEDBIN_PASS,
  },
});

function writeToCache(data) {
  const dir = "_cache";
  const fileContent = JSON.stringify(data, null, 2);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(CACHE_FILE_PATH, fileContent, (err) => {
    if (err) throw err;

    console.log(`@likes: cached to ${CACHE_FILE_PATH}`);
  });
}

function readFromCache() {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    const cacheFile = fs.readFileSync(CACHE_FILE_PATH);
    const cache = JSON.parse(cacheFile);

    if (cache && cache.length) {
      console.log(`@likes: previously fetched likes: ${cache.length}`);
    }

    return cache;
  }
  return [];
}

function validURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return !!pattern.test(str);
}

module.exports = async function addLikes() {
  console.log("@likes: fetching web mentions");

  const cache = readFromCache();

  if ((isProduction || !cache.length) && process.env.NODE_ENV !== "staging") {
    const { data: ids } = await http.get(STARED);
    const { data } = await http.get(ENTRIES, {
      params: { ids: ids.join(",") },
    });

    const likes = data
      .filter((post) => validURL(post.url))
      .map(({ id, published, url, title }) => ({ id, published, url, title }));

    writeToCache(likes);

    return likes;
  }

  return cache;
};
