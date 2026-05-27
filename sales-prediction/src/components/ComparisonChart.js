import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./comparison.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function ComparisonChart({ data = [] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const products = [...new Set(data.map(d => d.product))];

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
    setSearch(""); // hide dropdown after selection
  };

  const filteredData = data.filter(d =>
    selected.includes(d.product)
  );

  const chartData = {
    labels: filteredData.map(d =>
      d.product.replace(/\(.*?\)/g, "").trim()
    ),
    datasets: [
      {
        label: "Average Sales",
        data: filteredData.map(d => d.avg),
        backgroundColor: "#6b7280",
        borderRadius: 6
      },
      {
        label: "Predicted Demand",
        data: filteredData.map(d => d.predicted),
        backgroundColor: "#8b5cf6",
        borderRadius: 6
      },
      {
        label: "Recommended Order",
        data: filteredData.map(d => d.recommended),
        backgroundColor: "#06b6d4",
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="comparison-container">
      {/* Header */}
      <h2>📈 Product Comparison</h2>
      <p>Search and select exactly 2 products to compare their sales trends</p>

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
            "No products selected. Search and select 2 products to compare."
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

      {/* Dropdown (only when typing) */}
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
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" }
            },
            scales: {
              y: { beginAtZero: true },
              x: { grid: { display: false } }
            }
          }}
        />
      ) : (
        <div className="empty-state">
          <strong>No Products Selected</strong>
          <span>
            Use the search bar above to find and select 2 products to compare
            their sales trends over time.
          </span>
        </div>
      )}
    </div>
  );
}
