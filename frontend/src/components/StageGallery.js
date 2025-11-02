import React, { useState, useEffect } from "react";
import axios from "axios";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { FaTrash } from "react-icons/fa";
import "../App.css";

export default function StageGallery({ category }) {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // admin toggle
  const [password, setPassword] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch photos from backend
  useEffect(() => {
    axios
      .get(`http://localhost:8000/photos/${category}`)
      .then((res) => setPhotos(res.data))
      .catch((err) => console.error("Error fetching photos:", err));
  }, [category]);

  // Handle upload
  const handleUpload = async () => {
    if (!file) return alert("Select a photo first!");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPhotos((prev) => [...prev, res.data]);
      setFile(null);
      alert("✅ Photo uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await axios.delete(`http://localhost:8000/photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed.");
    }
  };

  // Simple admin login (no backend needed yet)
  const handleAdminLogin = () => {
    if (password === "anil123") {
      setIsAdmin(true);
      alert("✅ Admin mode activated!");
    } else {
      alert("❌ Wrong password!");
    }
  };

  return (
    <div className="stage-page">
      <h1>{category.toUpperCase()} Gallery</h1>
      <p>Explore beautiful {category} decorations and setups ✨</p>

      {/* 🧑‍💻 Admin Login Section */}
      {!isAdmin && (
        <div className="admin-login">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAdminLogin}>Login as Admin</button>
        </div>
      )}

      {/* Upload section (only for admin) */}
      {isAdmin && (
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload}>Upload Photo</button>
        </div>
      )}

      {/* Gallery */}
      <div className="gallery">
        {photos.length === 0 ? (
          <p>No photos yet. Upload your first one!</p>
        ) : (
          photos.map((photo, index) => (
            <div className="photo-container" key={photo._id}>
              <img
                src={photo.imageUrl}
                alt={category}
                onClick={() => {
                  setLightboxIndex(index);
                  setIsOpen(true);
                }}
              />
              {isAdmin && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(photo._id)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Lightbox for zoom + slideshow */}
      {isOpen && (
  <Lightbox
    open={isOpen}
    close={() => setIsOpen(false)}
    index={lightboxIndex}
    slides={photos.map((p) => ({ src: p.imageUrl }))}
    on={{
      view: ({ index }) => setLightboxIndex(index),
    }}
  />
)}

    </div>
  );
}
