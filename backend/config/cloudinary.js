// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Force load env variables
dotenv.config();

// Validate they exist
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Cloudinary credentials missing in environment");
  console.error("CLOUD_NAME exists:", !!process.env.CLOUDINARY_CLOUD_NAME);
  console.error("API_KEY exists:", !!process.env.CLOUDINARY_API_KEY);
  console.error("API_SECRET exists:", !!process.env.CLOUDINARY_API_SECRET);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log("✅ Cloudinary configured successfully");
}

export default cloudinary;
