module.exports = function tags(collections) {
  const BLACK_LIST = ["post", "all"];
  const clean = [
    ...new Set(
      Object.keys(collections).filter((tag) => !BLACK_LIST.includes(tag))
    ),
  ];

  return clean
    .sort((a, b) => {
      if (collections[a].length > collections[b].length) {
        return 1;
      }

      if (collections[a].length < collections[b].length) {
        return -1;
      }

      return 0;
    })
    .map((tag) => {
      return `<a class="tag tag--${tag.toLowerCase()}" href="/tag/${tag}" alt="all ${tag} posts">${tag}</a>`;
    })
    .join("");
};
