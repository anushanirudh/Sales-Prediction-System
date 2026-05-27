import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import "./trend.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function TrendChart({ data = [] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const products = [...new Set(data.map(d => d.product))];
  const months = [...new Set(data.map(d => d.month))];

  const filteredProducts =
    search.trim() === ""
      ? []
      : products.filter(p =>
          p.toLowerCase().includes(search.toLowerCase())
        );

  const toggleProduct = product => {
    if (selected.includes(product)) {
      setSelected(selected.filter(p => p !== product));
      return;
    }

    if (selected.length === 2) return;

    setSelected([...selected, product]);
    setSearch(""); // hide dropdown after select
  };

  const datasets = selected.map((product, i) => ({
    label: product,
    data: data
      .filter(d => d.product === product)
      .map(d => d.quantity),
    borderColor: i === 0 ? "#8b5cf6" : "#06b6d4",
    backgroundColor: "transparent",
    tension: 0.4,
    pointRadius: 5
  }));

  return (
    <div className="trend-container">
      {/* Header */}
      <h2>📈 Sales Trends</h2>
      <p>Search and select exactly 2 products to view their sales trends</p>

      {/* Selected Products */}
      <div style={{ marginBottom: "14px" }}>
        <strong>Selected Products ({selected.length}/2)</strong>

        <div
          style={{
            marginTop: "6px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "10px",
            color: selected.length ? "#111827" : "#6b7280",
            minHeight: "42px"
          }}
        >
          {selected.length === 0 ? (
            "No products selected. Search and select 2 products to view trends."
          ) : (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selected.map(p => (
                <span
                  key={p}
                  style={{
                    background: "#111827",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                  onClick={() => toggleProduct(p)}
                >
                  {p} ✕
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "10px" }}>
        <strong>Search Products</strong>
      </div>

      <input
        className="search-input"
        placeholder="🔍  Type to search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Dropdown */}
      {filteredProducts.length > 0 && (
        <div className="product-list">
          {filteredProducts.map(p => (
            <div
              key={p}
              className="product-item"
              onClick={() => toggleProduct(p)}
            >
              {p}
              {selected.includes(p) && (
                <span className="badge">Selected</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart / Empty */}
      {selected.length === 2 ? (
        <Line
          data={{ labels: months, datasets }}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: { y: { beginAtZero: true } }
          }}
        />
      ) : (
        <div className="empty-state">
          <strong>No Products Selected</strong>
          <span>
            Use the search bar above to find and select 2 products to view their
            sales trends over time.
          </span>
        </div>
      )}
    </div>
  );
}
