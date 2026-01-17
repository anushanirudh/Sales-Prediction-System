import { uploadCSVAndPredict } from "../services/api";

export default function UploadForm({ setAppData }) {

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadCSVAndPredict(file);

      // VERY IMPORTANT
      setAppData(result);

    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  };

  return (
    <input type="file" accept=".csv" onChange={handleUpload} />
  );
}
