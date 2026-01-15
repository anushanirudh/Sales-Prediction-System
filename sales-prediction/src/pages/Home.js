import { useState } from "react";
import UploadForm from "../components/UploadForm";
import Dashboard from "./Dashboard";
import sample from "../services/api";

export default function Home() {
  const [data, setData] = useState(null);

  return (
    <div className="container">
      <h1 className="title">Smart Inventory Predictor</h1>
      <p className="subtitle">
        AI-powered inventory management system that analyzes your sales history
        and recommends optimal order quantities
      </p>

      <UploadForm onSample={() => setData(sample)} />

      {data && <Dashboard data={data} />}
    </div>
  );
}
