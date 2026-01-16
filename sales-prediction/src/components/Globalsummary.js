import "./globalSummary.css";

export default function GlobalSummary({ data }) {
  // Best performer = highest profit
  const best = [...data].sort((a, b) => b.profit - a.profit)[0];

  return (
    <div className="global-summary">
      <div className="summary-card">
        <span className="icon green">↗</span>
        <div>
          <p className="label">Best Performer</p>
          <h3 className="green">{best.product}</h3>
          <span className="sub">Expected profit: ${best.profit}</span>
        </div>
      </div>

      <div className="summary-card">
        <div>
          <p className="label">Total Products</p>
          <h3 className="purple">{data.length}</h3>
          <span className="sub">Analyzed products</span>
        </div>
      </div>

      <div className="summary-card">
        <div>
          <p className="label">Average Confidence</p>
          <h3 className="blue">High</h3>
          <span className="sub">Based on data quality</span>
        </div>
      </div>
    </div>
  );
}
