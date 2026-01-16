import "./upload.css";

export default function UploadForm({ onSample }) {
  return (
    <div className="upload-container">
      <h2>Upload Your Sales Data</h2>
      <p>Import your historical sales data to get personalized predictions</p>

      <div className="upload-box">
        <div className="csv-info">
          <strong>CSV Format Required:</strong>
          <p>product, month, quantitySold, revenue</p>
          <p>Example: "Rice (kg)", "2025-01", 150, 600.00</p>
        </div>

        <div className="upload-actions">
          <button className="upload-btn">Upload CSV File</button>
          <span>or use the sample data below</span>
        </div>

        <p className="note">
          Currently showing sample data with 6 months of sales history.
        </p>

        <button onClick={onSample} className="sample-btn">
          Use Sample Data
        </button>
      </div>
    </div>
  );
}
