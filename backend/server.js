import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import connectDB from './db.js';
import Upload from './models/Upload.js';
import cloudinary from './cloudinaryConfig.js';
import stream from "stream";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(cors());
app.use(express.json());

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect MongoDB
connectDB();


/* ------------------- Upload Routes ------------------- */
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!req.file || !prompt) {
      return res.status(400).json({ message: "Image and prompt required" });
    }
    const appendText = " Keep facial features of the people exactly same without any changes";
    prompt = prompt + appendText;
    // Wrap Cloudinary upload_stream in a Promise
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        const cloudinaryStream = cloudinary.uploader.upload_stream(
          { folder: "ai_uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        bufferStream.pipe(cloudinaryStream);
      });
    };

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Save metadata to MongoDB
    const uploadEntry = await Upload.create({
      prompt,
      imageUrl: result.secure_url,
    });

    res.json(uploadEntry);

  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 }); // latest first
    res.json(uploads);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------- Feedback Feature ------------------- */

// Define feedback schema
const feedbackSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model("Feedback", feedbackSchema);

// POST /feedback → public (anyone can send feedback)
app.post("/feedback", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const fb = await Feedback.create({ message });
    res.json({ success: true, id: fb._id });
  } catch (err) {
    console.error("❌ Feedback save failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /feedback → private (only you with token can see)
app.get("/feedback", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(allFeedback);
  } catch (err) {
    console.error("❌ Feedback fetch failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

/* ------------------- Server ------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
