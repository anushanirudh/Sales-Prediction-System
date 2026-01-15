import { useState } from "react";
import TabBar from "../components/Tabbar";
import ResultsTable from "../components/ResultsTable";
import RecommendationCards from "../components/RecommendationCards";
import RecommendationNote from "../components/RecommendationNote";
import TrendChart from "../components/TrendChart";
import ComparisonChart from "../components/ComparisonChart";
import "../components/comparison.css";
import HistoricalTable from "../components/HistoricalTable";
import GlobalSummary from "../components/Globalsummary";



export default function Dashboard({ data }) {
  const [active, setActive] = useState("recommend");

  return (
    <>
      <TabBar active={active} setActive={setActive} />

      {/* TAB CONTENT */}
      {active === "recommend" && (
        <>
          <h2>Order Recommendations for Next Month</h2>
          <p>AI-powered predictions based on historical trends and demand patterns</p>
          <RecommendationCards data={data} />
          <ResultsTable data={data} />
          <RecommendationNote />
        </>
      )}

      {active === "trends" && (
        <>
          <h2>Sales Trend Analysis</h2>
          <p>Monthly sales quantity by product</p>
          <TrendChart />
        </>
      )}

      {active === "compare" && (
        <div className="comparison-container">
          <h2>Product Comparison</h2>
          <p>
            Historical average vs predicted demand vs recommended order quantity
          </p>
          <ComparisonChart data={data} />
        </div>
      )}

      {active === "history" && <HistoricalTable />}

      {/* 🔽 GLOBAL BOTTOM LAYER (ALWAYS VISIBLE) */}
      <GlobalSummary data={data} />
    </>
  );
}
