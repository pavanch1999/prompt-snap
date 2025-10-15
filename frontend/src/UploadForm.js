import React, { useState } from "react";
import "./UploadForm.css";

function UploadForm() {
  const [image, setImage] = useState(null);   // For preview
  const [file, setFile] = useState(null);     // Actual file
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0])); // preview
      setFile(e.target.files[0]); // actual file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !prompt) return alert("Please upload an image and enter a prompt!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", prompt);

      const res = await fetch("https://prompt-snap.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Uploaded:", data);
      alert("✅ Image uploaded successfully!");

      // reset form
      setImage(null);
      setFile(null);
      setPrompt("");

    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Suggest your AI Image prompt</h2>
      <form onSubmit={handleSubmit}>
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && (
          <div className="preview">
            <img src={image} alt="preview" />
          </div>
        )}

        <label>Enter AI Prompt</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your edit..."
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
