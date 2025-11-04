import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

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

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Schema
const PhotoSchema = new mongoose.Schema({
  url: String,
  type: String, // image or video
  category: String,
});
const Photo = mongoose.model("Photo", PhotoSchema);

// ✅ Multer setup (for memory uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ✅ Upload multiple files (photos/videos)
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const category = req.body.category || "general";
    const uploads = [];

    for (const file of req.files) {
      const type = file.mimetype.startsWith("video") ? "video" : "image";
      const result = await uploadToCloudinary(file.buffer, "celebratehub", type);
      uploads.push({
        url: result.secure_url,
        type,
        category,
      });
    }

    const saved = await Photo.insertMany(uploads);
    res.json(saved);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Get all photos/videos by category
app.get("/photos/:category", async (req, res) => {
  try {
    const media = await Photo.find({ category: req.params.category });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// ✅ Delete file
app.delete("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Media not found" });

    // delete from Cloudinary
    const publicId = photo.url.split("/").pop().split(".")[0];
    const folder = "celebratehub";
    await cloudinary.uploader.destroy(`${folder}/${publicId}`, {
      resource_type: photo.type === "video" ? "video" : "image",
    });

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.get("/", (req, res) => {
  res.send("🎉 CelebrateHub Backend with Cloudinary is Live!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
