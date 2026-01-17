import { useState } from "react";
import { uploadCSVAndPredict } from "../services/api";
import "./upload.css";

export default function UploadForm({ setAppData }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");

    try {
      const data = await uploadCSVAndPredict(file);
      setAppData(data); // 🔥 THIS CONNECTS EVERYTHING
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="upload-btn" onClick={handleUpload}>
          Upload CSV
        </button>
      </div>
    </div>
  );
}
