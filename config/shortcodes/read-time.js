const readTime = require("reading-time");

module.exports = function calcReadTime(body) {
  const BOOK = "📚";
  const BOOK_PER_MINUTES = 5;
  const { minutes } = readTime(body);
  const length = Math.ceil(minutes / BOOK_PER_MINUTES);
  const books = Array.from({ length }).fill(BOOK).join();

  return `${books} ${Math.ceil(minutes)} min read`;
};
