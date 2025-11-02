import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function GalleryTemplate({ category, title, description }) {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, [category]);

  const fetchPhotos = () => {
    axios
      .get(`http://localhost:8000/photos/${category}`)
      .then((res) => setPhotos(res.data))
      .catch((err) => console.error("Error fetching photos:", err));
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a photo!");
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
      console.error("Upload failed:", err);
      alert("❌ Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await axios.delete(`http://localhost:8000/photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      alert("🗑️ Photo deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Could not delete photo.");
    }
  };

  return (
    <div className="gallery-page">
      <h1>{title}</h1>
      <p>{description}</p>

      <div className="gallery">
        {photos.length === 0 ? (
          <p>No photos yet. Upload your first one!</p>
        ) : (
          photos.map((photo) => (
            <div
              className="photo-container"
              key={photo._id}
            >
              <img
                src={photo.imageUrl}
                alt={category}
                onClick={() => setSelectedPhoto(photo.imageUrl)}
              />
              <button
                className="delete-btn"
                onClick={() => handleDelete(photo._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload Photo</button>
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={() => setSelectedPhoto(null)}>
          <span className="close">&times;</span>
          <img className="modal-content" src={selectedPhoto} alt="zoom" />
        </div>
      )}
    </div>
  );
}
