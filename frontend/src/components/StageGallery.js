import React, { useState, useEffect } from "react";
import axios from "axios";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const StageGallery = () => {
  const [category] = useState("stage");
  const [media, setMedia] = useState([]);
  const [files, setFiles] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const BASE_URL = "https://celebratehub.onrender.com";

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/photos/${category}`);
      setMedia(res.data);
    } catch (err) {
      console.error("❌ Error fetching media:", err);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return alert("Select at least one file!");
    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    formData.append("category", category);

    try {
      await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([]);
      fetchMedia();
      alert("✅ Uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/photos/${id}`);
      fetchMedia();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // Get only images for lightbox
  const imageItems = media.filter((m) => m.type === "image");
  const imageUrls = imageItems.map((m) => m.url);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 className="text-2xl font-bold mb-4">🎭 Stage Gallery</h2>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button
        onClick={handleUpload}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          background: "teal",
          color: "white",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upload
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        {media.map((item, i) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt="media"
                onClick={() => {
                  const imageIndex = imageItems.findIndex(
                    (img) => img._id === item._id
                  );
                  setLightboxIndex(imageIndex);
                  setIsLightboxOpen(true);
                }}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  cursor: "zoom-in",
                }}
              />
            ) : (
              <video
                src={item.url}
                controls
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            )}
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {isLightboxOpen && imageUrls.length > 0 && (
        <Lightbox
          mainSrc={imageUrls[lightboxIndex]}
          nextSrc={imageUrls[(lightboxIndex + 1) % imageUrls.length]}
          prevSrc={imageUrls[(lightboxIndex + imageUrls.length - 1) % imageUrls.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + imageUrls.length - 1) % imageUrls.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % imageUrls.length)
          }
        />
      )}
    </div>
  );
};

export default StageGallery;
