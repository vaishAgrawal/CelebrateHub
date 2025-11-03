// backend/server.js
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// ✅ Allow frontend domains
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://celebrate-hub-21hs.vercel.app",
      "https://celebrate-hub-21hs-7s6xmqxjh.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// ✅ File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Schema
const PhotoSchema = new mongoose.Schema({
  imageUrl: String,
  category: String,
});
const Photo = mongoose.model("Photo", PhotoSchema);

// ✅ Multer (local temp storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});
const upload = multer({ storage });

// ✅ Upload Route (upload → Cloudinary)
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const localPath = path.join(__dirname, "uploads", req.file.filename);

    // 📤 Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      folder: "celebratehub",
      resource_type: "image",
    });

    // 🗑️ Delete local file after upload
    fs.unlinkSync(localPath);

    // 💾 Save to MongoDB
    const photo = new Photo({
      imageUrl: uploadResult.secure_url,
      category: req.body.category,
    });

    await photo.save();
    res.json(photo);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Get photos by category
app.get("/photos/:category", async (req, res) => {
  try {
    const photos = await Photo.find({ category: req.params.category });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// ✅ Delete photo (Cloudinary + MongoDB)
app.delete("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // Optional: extract Cloudinary public_id for deletion
    const parts = photo.imageUrl.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `celebratehub/${filename.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId);

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🎉 CelebrateHub Backend is Live with Cloudinary!");
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
