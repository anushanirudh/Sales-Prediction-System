import "./historical.css";

export default function HistoricalTable({ data }) {
  return (
    <div className="history-container">
      <h2>Historical Sales Data</h2>
      <p>Previous months sales performance by product</p>

      <table className="history-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Month</th>
            <th>Quantity Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.product}</td>
              <td>{row.month}</td>
              <td className="center">{row.quantity}</td>
              <td className="right">${row.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
