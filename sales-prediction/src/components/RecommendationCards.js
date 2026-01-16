import "./recommend.css";

export default function RecommendationCards({ data }) {
  const investment = data.reduce((a, b) => a + b.investment, 0);
  const revenue = data.reduce((a, b) => a + b.investment + b.profit, 0);
  const profit = data.reduce((a, b) => a + b.profit, 0);

  return (
    <div className="cards-row">
      <div className="card blue">
        <p>Total Investment Required</p>
        <h2>${investment.toFixed(2)}</h2>
      </div>

      <div className="card green">
        <p>Expected Revenue</p>
        <h2>${revenue.toFixed(2)}</h2>
      </div>

      <div className="card purple">
        <p>Expected Profit</p>
        <h2>${profit.toFixed(2)}</h2>
      </div>
    </div>
  );
}
