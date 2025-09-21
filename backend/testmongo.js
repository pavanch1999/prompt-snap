import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema({
  prompt: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Upload = mongoose.model("Upload", UploadSchema);

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const entry = await Upload.create({
      prompt: "Test prompt",
      imageUrl: "https://res.cloudinary.com/dcrddh9lw/image/upload/v1758173457/ai_uploads/l9kcnifv0whkgowhg4cf.jpg",
    });

    console.log("MongoDB entry saved:", entry);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

test();
