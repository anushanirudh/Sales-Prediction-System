import { useState } from "react";

import UploadForm from "../components/UploadForm";
import RecommendationCards from "../components/RecommendationCards";
import ResultsTable from "../components/ResultsTable";
import RecommendationNote from "../components/RecommendationNote";
import TrendChart from "../components/TrendChart";
import ComparisonChart from "../components/ComparisonChart";
import HistoricalTable from "../components/HistoricalTable";

export default function Dashboard() {
  const [appData, setAppData] = useState(null);

  const [activePage, setActivePage] = useState(
    "recommendations"
  );

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <h2>StockSense</h2>
          <span>Inventory Intelligence</span>
        </div>

        <div className="menu-title">Analytics</div>

        <button
          className={
            activePage === "recommendations"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setActivePage("recommendations")
          }
        >
          Recommendations
        </button>

        <button
          className={
            activePage === "trends"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setActivePage("trends")
          }
        >
          Trends
        </button>

        <button
          className={
            activePage === "comparison"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setActivePage("comparison")
          }
        >
          Comparison
        </button>

        <button
          className={
            activePage === "history"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setActivePage("history")
          }
        >
          Historical Data
        </button>

        <button
          className={
            activePage === "import"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setActivePage("import")
          }
        >
          Import Data
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-panel">
        {/* HEADER */}
        <div className="header">
          <div>
            <div className="breadcrumb">
              Analytics &gt;{" "}
              {activePage === "recommendations" &&
                "Recommendations"}
              {activePage === "trends" && "Trends"}
              {activePage === "comparison" &&
                "Comparison"}
              {activePage === "history" &&
                "Historical Data"}
              {activePage === "import" &&
                "Import Data"}
            </div>

            <h1>
              {activePage === "recommendations" &&
                "Recommendations"}
              {activePage === "trends" && "Trends"}
              {activePage === "comparison" &&
                "Comparison"}
              {activePage === "history" &&
                "Historical Data"}
              {activePage === "import" &&
                "Import Data"}
            </h1>

            <p className="subtitle">
              {activePage === "recommendations" &&
                "AI-powered order suggestions"}
              {activePage === "trends" &&
                "Sales trend analysis"}
              {activePage === "comparison" &&
                "Compare products"}
              {activePage === "history" &&
                "Raw sales records"}
              {activePage === "import" &&
                "Upload CSV file"}
            </p>
          </div>

          <div className="filters">
            <button>Products 6</button>
            <button>Jan 2026</button>
            <button className="active-filter">
              Trend+Safety
            </button>
          </div>
        </div>

        {/* IF NO DATA YET */}
        {!appData &&
          activePage !== "import" && (
            <div className="empty-upload">
              <h2>Upload a CSV file first</h2>

              <p>
                Go to Import Data and upload your
                sales history.
              </p>
            </div>
          )}

        {/* IMPORT PAGE */}
        {activePage === "import" && (
          <UploadForm
            setAppData={setAppData}
          />
        )}

        {/* RECOMMENDATIONS */}
        {appData &&
          activePage ===
            "recommendations" && (
            <>
              <RecommendationCards
                data={appData.recommendations}
              />

              <div className="table-wrapper">
                <ResultsTable
                  data={
                    appData.recommendations
                  }
                />
              </div>

              <RecommendationNote />
            </>
          )}

        {/* TRENDS */}
        {appData &&
          activePage === "trends" && (
            <TrendChart
              data={appData.trends}
            />
          )}

        {/* COMPARISON */}
        {appData &&
          activePage === "comparison" && (
            <ComparisonChart
              data={appData.comparison}
            />
          )}

        {/* HISTORY */}
        {appData &&
          activePage === "history" && (
            <HistoricalTable
              data={appData.historical}
            />
          )}
      </main>
    </div>
  );
}