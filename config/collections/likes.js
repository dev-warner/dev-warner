const axios = require("axios");

const BASE = "https://api.feedbin.com/v2/";
const STARED = `starred_entries.json`;
const ENTRIES = `entries.json`;

const http = axios.create({
  baseURL: BASE,
  auth: {
    username: process.env.FEEDBIN_EMAIL,
    password: process.env.FEEDBIN_PASS,
  },
});

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
  const { data: ids } = await http.get(STARED);
  const { data } = await http.get(ENTRIES, {
    params: { ids: ids.join(",") },
  });

  return data.filter((post) => validURL(post.url));
};
