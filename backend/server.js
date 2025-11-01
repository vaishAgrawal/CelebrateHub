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

// middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Schema
const PhotoSchema = new mongoose.Schema({
  imageUrl: String,
  category: String,
});
const Photo = mongoose.model("Photo", PhotoSchema);

// Multer config (local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const photo = new Photo({
      imageUrl: `http://localhost:8000/uploads/${req.file.filename}`,
      category: req.body.category,
    });
    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/photos/:category", async (req, res) => {
  try {
    const photos = await Photo.find({ category: req.params.category });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Delete a photo by ID
app.delete("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // Delete image file from uploads folder
    const filePath = path.join(__dirname, "uploads", path.basename(photo.imageUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});


const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
