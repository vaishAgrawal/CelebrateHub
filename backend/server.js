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
const MediaSchema = new mongoose.Schema({
  url: String,
  category: String,
  type: String, // 'image' or 'video'
});
const Media = mongoose.model("Media", MediaSchema);

// ✅ Multer config — local temp upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Upload Route — multiple files
app.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploaded = [];

    for (const file of req.files) {
      const localPath = path.join(__dirname, "uploads", file.filename);

      // detect type
      const resourceType = file.mimetype.startsWith("video") ? "video" : "image";

      // upload to Cloudinary
      const result = await cloudinary.uploader.upload(localPath, {
        folder: "celebratehub",
        resource_type: resourceType,
      });

      fs.unlinkSync(localPath); // remove local temp file

      const media = new Media({
        url: result.secure_url,
        category: req.body.category,
        type: resourceType,
      });
      await media.save();
      uploaded.push(media);
    }

    res.json(uploaded);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Get media by category
app.get("/photos/:category", async (req, res) => {
  try {
    const media = await Media.find({ category: req.params.category });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// ✅ Delete media
app.delete("/photos/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    // Delete from Cloudinary
    const publicId = media.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`celebratehub/${publicId}`, {
      resource_type: media.type,
    });

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.get("/", (req, res) => {
  res.send("🎉 CelebrateHub Backend is Live with Cloudinary + Video Uploads!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
