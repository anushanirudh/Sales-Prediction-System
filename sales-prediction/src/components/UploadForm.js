import { uploadCSVAndPredict } from "../services/api";
import "./upload.css";

export default function UploadForm({ setAppData }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadCSVAndPredict(file);
      console.log("FULL API RESPONSE");
      console.log(result);

      setAppData(result);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Sales Data</h2>

      <p className="upload-subtitle">
        Import your historical sales data to get personalized predictions
      </p>

      <div className="csv-info">
        <div className="csv-title">
          CSV Format Required:
        </div>

        <div className="csv-example">
          product, month, quantitySold, revenue
        </div>

        <div className="csv-example">
          Example: "Rice (kg)", "2025-01", 150, 600.00
        </div>
      </div>

      <div className="upload-actions">
        <label className="upload-btn">
          Upload CSV File

          <input
            type="file"
            accept=".csv"
            onChange={handleUpload}
            hidden
          />
        </label>

        <span className="upload-hint">
          or use the sample data below
        </span>
      </div>

      <div className="upload-note">
        Currently showing sample data with 6 months of sales history.
      </div>
    </div>
  );
}