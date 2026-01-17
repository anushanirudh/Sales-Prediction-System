import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const uploadCSVAndPredict = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Upload CSV
  const uploadRes = await axios.post(
    `${BASE_URL}/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  // Trigger ML prediction
  const predictRes = await axios.post(
    `${BASE_URL}/predict`,
    uploadRes.data
  );

  return predictRes.data;
};
