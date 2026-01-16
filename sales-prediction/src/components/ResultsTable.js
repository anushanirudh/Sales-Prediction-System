import "./recommend.css";

export default function ResultsTable({ data }) {
  return (
    <table className="rec-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Trend</th>
          <th>Avg Sales</th>
          <th>Predicted Demand</th>
          <th>Recommended Order</th>
          <th>Investment</th>
          <th>Expected Profit</th>
          <th>Margin</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p) => (
          <tr key={p.product}>
            <td>{p.product}</td>
            <td className={p.trend > 0 ? "up" : "down"}>
              {p.trend > 0 ? "▲" : "▼"} {p.trend}%
            </td>
            <td>{p.avg}</td>
            <td>{p.predicted}</td>
            <td className="blue">{p.recommended}</td>
            <td>${p.investment.toFixed(2)}</td>
            <td className="green">${p.profit.toFixed(2)}</td>
            <td>{p.margin}%</td>
            <td><span className="pill">high</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
