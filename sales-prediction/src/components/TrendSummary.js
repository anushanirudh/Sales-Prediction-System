import "./trend.css";

export default function TrendSummary() {
  return (
    <div className="trend-cards">
      <div className="trend-card green">
        <p>Best Performer</p>
        <h3>Cooking Oil (L)</h3>
        <span>Expected profit: $330</span>
      </div>

      <div className="trend-card purple">
        <p>Total Products</p>
        <h3>6</h3>
        <span>Analyzed products</span>
      </div>

      <div className="trend-card blue">
        <p>Average Confidence</p>
        <h3>High</h3>
        <span>Based on data quality</span>
      </div>
    </div>
  );
}
