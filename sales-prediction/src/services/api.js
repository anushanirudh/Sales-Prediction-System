import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const uploadCSVAndPredict = async (file) => {

  try {

    const formData = new FormData();

    formData.append("file", file);

    console.log("Uploading CSV...");

    // UPLOAD CSV
    const uploadRes = await axios.post(
      `${BASE_URL}/upload/`,
      formData,
      { 
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("UPLOAD SUCCESS");
    console.log(uploadRes.data);

    // PREDICT
    const predictRes = await axios.post(
      `${BASE_URL}/predict/`
    );

    console.log("PREDICTION SUCCESS");
    console.log(predictRes.data);

    return predictRes.data;

  } catch (error) {

    console.error("API ERROR:", error);

    if (error.response) {
      console.error(
        "BACKEND ERROR:",
        error.response.data
      );
    }

    throw error;
  }
};