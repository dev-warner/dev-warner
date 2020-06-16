const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const express = require("express");
const { async } = require("regenerator-runtime");

async function startServer() {
  return new Promise((resolve, rejects) => {
    const app = express();

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "templates"));
    app.use("/", express.static(path.join(__dirname, "templates")));

    const server = app.listen(0, () => {
      resolve({ server, app });
    });
  });
}

async function generateCard() {
  const [browser, { server, app }] = await Promise.all([
    puppeteer.launch({
      args: [`--window-size=876,440`],
      defaultViewport: { width: 876, height: 440 },
    }),
    startServer(),
  ]);

  if (!fs.existsSync("./_site")) fs.mkdirSync("./_site");
  if (!fs.existsSync("./_site/assets")) fs.mkdirSync("./_site/assets");

  const { port } = server.address();

  return {
    card: async ({ fileName, ...props }) => {
      app.get(`/${fileName}`, (_, res) => res.render("index", { ...props }));

      const page = await browser.newPage();

      await page.goto(`http://localhost:${port}/${fileName}`, {
        waitUntil: "networkidle0",
      });

      await page.screenshot({
        type: "png",
        path: `./_site/assets/${fileName}.png`,
        fullPage: true,
      });

      await page.close();

      return `/assets/${fileName}.png`;
    },
    close: async () => {
      browser.close();
      server.close();
    },
  };
}

const COLOR = {
  javascript: {
    color: "#f0db4f",
    image: "javascript.png",
  },
  typescript: {
    color: "#007acc",
    image: "typescript.png",
  },
  react: {
    color: "#61DBFB",
    image: "react.png",
  },
  sass: {
    color: "#c69",
    image: "sass.png",
  },
  css: {
    color: "#2965f1",
  },
};

module.exports = async (collections) => {
  const screenshot = await generateCard();
  const coll = collections.getFilteredByTag("post");
  const screenshoted = coll.map(async (post) => {
    const tag = COLOR[post.data.tags[1]];

    if (post.data.page && post.data.page.url) {
      try {
        await screenshot.card({
          fileName: post.data.page.fileSlug.toLowerCase().split(" ").join("-"),
          title: post.data.title,
          date: post.date,
          tag: tag.image,
          color: tag.color,
          author: "me.jpg",
        });
      } catch (err) {}
    }

    return post;
  });

  await Promise.all(screenshoted);

  screenshot.close();
};
