export default function ResultsTable({ data = [] }) {

  if (!data.length) {
    return <p>No prediction data available</p>;
  }

  return (
    <table className="results-table">
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
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.product}</td>
            <td>{row.trend}</td>
            <td>{row.avg_sales}</td>
            <td>{row.predicted_demand}</td>
            <td className="blue">{row.recommended_order}</td>
            <td>${Number(row.investment || 0).toFixed(2)}</td>
            <td className="green">
              ${Number(row.expected_profit || 0).toFixed(2)}
            </td>
            <td>{row.margin}%</td>
            <td>
              <span className={`badge ${row.confidence}`}>
                {row.confidence}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
