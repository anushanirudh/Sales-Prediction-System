import { useState } from "react";

// components
import UploadForm from "../components/UploadForm";
import Tabbar from "../components/Tabbar";
import RecommendationCards from "../components/RecommendationCards";
import ResultsTable from "../components/ResultsTable";
import RecommendationNote from "../components/RecommendationNote";
import TrendChart from "../components/TrendChart";
import ComparisonChart from "../components/ComparisonChart";
import HistoricalTable from "../components/HistoricalTable";
import GlobalSummary from "../components/Globalsummary";

export default function Dashboard() {
  // 🔑 STEP 5: CENTRAL STATE
  const [appData, setAppData] = useState(null);

  // tab state
  const [active, setActive] = useState("recommend");

  return (
    <div className="dashboard-container">
      {/* CSV UPLOAD (sets appData) */}
      <UploadForm setAppData={setAppData} />

      {/* TAB BAR */}
      <Tabbar active={active} setActive={setActive} />

      {/* TAB CONTENT (render only after CSV upload) */}
      {appData && (
        <>
          {/* RECOMMENDATIONS TAB */}
          {active === "recommend" && (
            <>
              <h2>Order Recommendations for Next Month</h2>
              <p>
                AI-powered predictions based on historical trends and demand
                patterns
              </p>

              <RecommendationCards data={appData.recommendations} />
              <ResultsTable data={appData.recommendations} />
              <RecommendationNote />
            </>
          )}

          {/* TRENDS TAB */}
          {active === "trends" && (
            <>
              <h2>Sales Trend Analysis</h2>
              <p>Monthly sales quantity by product</p>

              <TrendChart data={appData.trends} />
            </>
          )}

          {/* COMPARISON TAB */}
          {active === "compare" && (
            <>
              <h2>Product Comparison</h2>
              <p>
                Historical average vs predicted demand vs recommended order
                quantity
              </p>

              <ComparisonChart data={appData.comparison} />
            </>
          )}

          {/* HISTORICAL DATA TAB */}
          {active === "history" && (
            <HistoricalTable data={appData.historical} />
          )}

          {/* 🔽 GLOBAL SUMMARY (ALWAYS VISIBLE) */}
          <GlobalSummary data={appData.recommendations} />
        </>
      )}
    </div>
  );
}
