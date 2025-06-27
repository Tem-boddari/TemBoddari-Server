const express = require("express");
const router = express.Router();
const MetaCache = require("../models/MetaCache");

// const cheerio = require("cheerio");
// const fs = require("fs");
// const ogs = require("open-graph-scraper");

// function toAbsoluteUrl(base, src) {
//   if (!src) return null;
//   try {
//     return new URL(src, base).href;
//   } catch {
//     return src;
//   }
// }

// 도메인별 커스텀 파싱 함수
// function getDomain(url) {
//   try {
//     return new URL(url).hostname.replace(/^www\./, "");
//   } catch {
//     return "";
//   }
// }

// function parseCoupang($, url) {
//   const og = $('meta[property="og:image"]').attr("content");
//   if (og) return toAbsoluteUrl(url, og);

//   const img = $("img.prod-image__detail").attr("src");
//   if (img) return toAbsoluteUrl(url, img);

//   return null;
// }

// function parse11st($) {
//   const og = $('meta[property="og:image"]').attr("content");
//   if (og) return og;
//   const img = $("img#mainImg").attr("src");
//   if (img) return img;
//   return null;
// }

// function parseNaver($) {
//   const og = $('meta[property="og:image"]').attr("content");
//   if (og) return og;
//   const img = $("img._2T9XK").attr("src");
//   if (img) return img;
//   return null;
// }

// function parseBestEffort($, url) {
//   const og = $('meta[property="og:image"]').attr("content");
//   if (og) return toAbsoluteUrl(url, og);

//   const twitter = $('meta[name="twitter:image"]').attr("content");
//   if (twitter) return toAbsoluteUrl(url, twitter);

//   const link = $('link[rel="image_src"]').attr("href");
//   if (link) return toAbsoluteUrl(url, link);

//   const img = $("img").first().attr("src");
//   if (img) return toAbsoluteUrl(url, img);

//   return null;
// }

router.get("/", async (req, res) => {
  const queryUrl = req.query.url;
  if (!queryUrl) return res.status(400).json({ error: "url required" });

  try {
    const cached = await MetaCache.findOne({ url: queryUrl });
    if (cached) {
      return res.json({ image: cached.image, cached: true });
    }

    const apiUrl = `https://iframe.ly/api/iframely?url=${queryUrl}&key=70dc2b88c46cbf001c2e771ea9526014`;
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    const image =
      data.links?.thumbnail?.[0]?.href ||
      data.links?.icon?.[0]?.href ||
      data.links?.image?.[0]?.href ||
      "/default-image.svg";

    await MetaCache.create({ url: queryUrl, image });

    res.json({ image, cached: false });

    // const resp = await fetch(url, {
    //   headers: {
    //     "User-Agent": "Daum",
    //   },
    // });
    // const html = await resp.text();
    // fs.writeFileSync("./sample.html", html);
    // const $ = cheerio.load(html);
    // const domain = getDomain(url);
    // let image = null;
    // if (domain.includes("coupang")) {
    //   image = parseCoupang($, url);
    // } else if (domain.includes("11st")) {
    //   image = parse11st($, url);
    // } else if (domain.includes("naver")) {
    //   image = parseNaver($, url);
    // }
    // if (!image) {
    //   image = parseBestEffort($, url);
    // }
    // if (!image) {
    //   image = "/default-image.svg"; // 프론트에서 public에 기본 이미지 두세요
    // }
    // res.json({ image });
  } catch (e) {
    console.error(e);
    res.json({ image: "/default-image.svg", error: "메타데이터 추출 실패" });
  }
});

module.exports = router;
