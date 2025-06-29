const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const MetaImage = require("../models/MetaImage");
const router = express.Router();

// 메모리 스토리지 (Cloudinary로 바로 업로드)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("지원하지 않는 파일 형식입니다."));
    }
  },
});

// 직접 이미지 업로드
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "파일이 없습니다." });
    }

    // Cloudinary에 업로드
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "recommendations",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      message: "이미지 업로드 성공",
    });
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    res.status(500).json({ error: "이미지 업로드 중 오류가 발생했습니다." });
  }
});

// URL에서 메타데이터 이미지 가져오기 (캐싱 포함)
router.post("/meta", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL이 필요합니다." });
    }

    // 캐시에서 먼저 확인
    let metaImage = await MetaImage.findOne({ url });

    if (metaImage) {
      return res.json({
        success: true,
        imageUrl: metaImage.image_url,
        cached: true,
        message: "캐시된 메타데이터 이미지",
      });
    }

    const metaRes = await fetch(
      `${req.protocol}://${req.get("host")}/api/meta?url=${encodeURIComponent(
        url
      )}`
    );
    const metaData = await metaRes.json();

    if (!metaData.image || metaData.image === "/default-image.svg") {
      return res.status(404).json({ error: "이미지를 찾을 수 없습니다." });
    }

    // Cloudinary에 업로드
    const result = await cloudinary.uploader.upload(metaData.image, {
      folder: "recommendations/meta",
    });

    // DB에 캐시 저장
    metaImage = await MetaImage.create({
      url,
      image_url: result.secure_url,
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      cached: false,
      message: "메타데이터 이미지 업로드 성공",
    });
  } catch (error) {
    console.error("메타데이터 이미지 처리 오류:", error);
    res
      .status(500)
      .json({ error: "메타데이터 이미지 처리 중 오류가 발생했습니다." });
  }
});

// 메타데이터 이미지 가져오기 함수
async function getMetaImage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Open Graph 이미지 찾기
    const ogImageMatch = html.match(
      /<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i
    );
    const ogTitleMatch = html.match(
      /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i
    );
    const ogDescMatch = html.match(
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i
    );

    // 일반 이미지 태그 찾기
    const imgMatch = html.match(/<img[^>]*src="([^"]*)"[^>]*>/i);

    const imageUrl = ogImageMatch?.[1] || imgMatch?.[1];
    const title = ogTitleMatch?.[1] || "";
    const description = ogDescMatch?.[1] || "";

    return {
      imageUrl: imageUrl ? new URL(imageUrl, url).href : null,
      title,
      description,
    };
  } catch (error) {
    console.error("메타데이터 파싱 오류:", error);
    return { imageUrl: null, title: "", description: "" };
  }
}

module.exports = router;
