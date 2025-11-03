import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// ✅ Setup CORS (for both local & deployed frontend)
app.use(
  cors({
    origin: ["http://localhost:3000", "https://celebrate-hub-21hs.vercel.app"],
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());

// ✅ File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Schema
const PhotoSchema = new mongoose.Schema({
  imageUrl: String,
  category: String,
});
const Photo = mongoose.model("Photo", PhotoSchema);

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Upload Route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // IMPORTANT: use Render URL instead of localhost
    const BASE_URL = "https://celebratehub.onrender.com";
    const photo = new Photo({
      imageUrl: `https://celebratehub.onrender.com/uploads/uploads/${req.file.filename}`,
      category: req.body.category,
    });
    await photo.save();
    res.json(photo);
  } catch (err) {
    console.error("Upload failed:", err);
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

// ✅ Delete a photo by ID
app.delete("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    const filePath = path.join(__dirname, "uploads", path.basename(photo.imageUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

// ✅ Default route for Render check
app.get("/", (req, res) => {
  res.send("🎉 CelebrateHub Backend is Live!");
});

// ✅ Port setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
