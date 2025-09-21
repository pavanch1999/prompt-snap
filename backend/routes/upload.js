import express from "express";
import multer from "multer";
import cloudinary from "../cloudinaryConfig.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "ai_gallery" }, // optional folder
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({
          imageUrl: result.secure_url,
          prompt: req.body.prompt,
        });
      }
    );

    // Pipe buffer to cloudinary
    if (file && file.buffer) {
      result.end(file.buffer);
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
