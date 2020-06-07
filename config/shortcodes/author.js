module.exports = function author(author) {
  if (!author) {
    return `
<div class="author--name">
  <img class="author" src="/assets/me.jpeg" alt="me" />

  <span>By Joe Warner</span>
</div>`;
  }

  const photo = author.photo
    ? `<img src="${author.photo}" alt="${author.name}" />`
    : "";

  function container(content) {
    if (author.url) {
      return `<a class="author" target="_blank" rel="noopener" href="${author.url}">${content}</a>`;
    }

    return `<div class="author">${content}</div>`;
  }

  return container(`${photo}`);
};
