import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
// const imagePath = "C:\\Users\\hello\\Downloads\\a.jfif"; // replace with your image

// cloudinary.uploader.upload(imagePath, { folder: "ai_uploads" }, (err, result) => {
//   if (err) {
//     console.error("Upload failed:", err);
//   } else {
//     console.log("Cloudinary upload successful!");
//     console.log(result.secure_url); // this is the image URL
//   }
// });