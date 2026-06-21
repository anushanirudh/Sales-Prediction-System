import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

/* ─── Custom Tooltip for Bar Chart ─────────────────── */
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="comparison-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          style={{ color: entry.color }}
          className="tooltip-row"
        >
          {entry.name} : {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ─── Search / Select Bar ───────────────────────────── */
function ProductSearchBar({ products, selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = products.filter(
    (p) =>
      p.toLowerCase().includes(query.toLowerCase()) &&
      !selected.includes(p)
  );

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="search-bar-wrapper" ref={ref}>
      {/* Selected chips */}
      <div className="search-chips-row">
        {selected.map((p) => (
          <span key={p} className="chip">
            {p}
            <span
              className="chip-remove"
              onClick={() => onSelect(selected.filter((x) => x !== p))}
            >
              ×
            </span>
          </span>
        ))}

        <input
          className="search-input"
          placeholder={
            selected.length === 0
              ? "Search and select products to compare…"
              : "Add another product…"
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="search-dropdown">
          {filtered.map((p) => (
            <div
              key={p}
              className="search-option"
              onMouseDown={() => {
                onSelect([...selected, p]);
                setQuery("");
                setOpen(false);
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────── */
export default function ComparisonChart({ data }) {
  const allProducts = data ? data.map((d) => d.product) : [];
  const [selected, setSelected] = useState(
    allProducts.length >= 2 ? [allProducts[0], allProducts[1]] : allProducts
  );

  if (!data || data.length === 0) {
    return (
      <div className="comparison-empty">
        <p>No comparison data available.</p>
      </div>
    );
  }

  const filteredData = data.filter((d) => selected.includes(d.product));

  /* Bar chart data — one entry per selected product */
  const barData = filteredData.map((d) => ({
    name: d.product,
    "Avg Sales": Number(d.avgSales || 0),
    Predicted: Number(d.predicted || 0),
    Order: Number(d.order || 0),
  }));

  /* Radar chart data — axes = metrics, each product is a series */
  const radarAxes = ["Demand", "Profit", "Trend %", "Stock Level", "Velocity"];
  const radarData = radarAxes.map((axis) => {
    const entry = { axis };
    filteredData.forEach((d) => {
      entry[d.product] = d.radar?.[axis] ?? 0;
    });
    return entry;
  });

  const RADAR_COLORS = ["#9b5de5", "#00d9c4"];
  const comparingLabel =
    filteredData.length >= 2
      ? `${filteredData[0].product} vs ${filteredData[1].product}`
      : filteredData[0]?.product ?? "";

  return (
    <div className="comparison-root">
      {/* ── Product Search Bar ───────────── */}
      <ProductSearchBar
        products={allProducts}
        selected={selected}
        onSelect={setSelected}
      />

      {selected.length === 0 && (
        <div className="comparison-empty">
          <p>Select at least one product to compare.</p>
        </div>
      )}

      {selected.length > 0 && (
        <>
          {/* ── Prediction Metrics Comparison ── */}
          <div className="comparison-card">
            <div className="card-header">
              <h3>Prediction Metrics Comparison</h3>
              {filteredData.length >= 2 && (
                <p className="card-subtitle">Comparing: {comparingLabel}</p>
              )}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                barCategoryGap="40%"
                barGap={4}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8892a4", fontSize: 13 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8892a4", fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(200,210,230,0.08)" }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "16px",
                    fontSize: "13px",
                    color: "#8892a4",
                  }}
                />
                <Bar
                  dataKey="Avg Sales"
                  fill="#4a5568"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={80}
                />
                <Bar
                  dataKey="Predicted"
                  fill="#9b5de5"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={80}
                />
                <Bar
                  dataKey="Order"
                  fill="#00d9c4"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Performance Radar ───────────── */}
          <div className="comparison-card">
            <div className="card-header">
              <h3>Performance Radar</h3>
              <p className="card-subtitle">
                Multi-dimensional comparison of key metrics
              </p>
            </div>

            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#8892a4", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#8892a4", fontSize: 10 }}
                  axisLine={false}
                />
                {filteredData.map((d, i) => (
                  <Radar
                    key={d.product}
                    name={d.product}
                    dataKey={d.product}
                    stroke={RADAR_COLORS[i % RADAR_COLORS.length]}
                    fill={RADAR_COLORS[i % RADAR_COLORS.length]}
                    fillOpacity={0.25}
                  />
                ))}
                <Legend
                  wrapperStyle={{
                    paddingTop: "12px",
                    fontSize: "13px",
                    color: "#8892a4",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a2234",
                    border: "1px solid #2d3748",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <style>{`
        .comparison-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 4px 0;
        }

        /* ── Search Bar ── */
        .search-bar-wrapper {
          position: relative;
          background: #111827;
          border: 1px solid #2d3748;
          border-radius: 10px;
          padding: 8px 12px;
          min-height: 46px;
        }
        .search-chips-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1e2d45;
          border: 1px solid #2d4a6e;
          border-radius: 6px;
          padding: 3px 10px 3px 12px;
          font-size: 13px;
          color: #e2e8f0;
          font-weight: 500;
        }
        .chip-remove {
          cursor: pointer;
          color: #64748b;
          font-size: 16px;
          line-height: 1;
          margin-left: 2px;
          transition: color 0.15s;
        }
        .chip-remove:hover { color: #00d9c4; }
        .search-input {
          flex: 1;
          min-width: 200px;
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-size: 14px;
          padding: 4px 0;
        }
        .search-input::placeholder { color: #4a5568; }
        .search-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #111827;
          border: 1px solid #2d3748;
          border-radius: 8px;
          z-index: 50;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .search-option {
          padding: 10px 16px;
          font-size: 14px;
          color: #c4cdd9;
          cursor: pointer;
          transition: background 0.12s;
        }
        .search-option:hover {
          background: #1e2d45;
          color: #00d9c4;
        }

        /* ── Cards ── */
        .comparison-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 24px 28px;
        }
        .card-header { margin-bottom: 20px; }
        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 4px;
        }
        .card-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        /* ── Tooltip ── */
        .comparison-tooltip {
          background: #1a2234;
          border: 1px solid #2d3748;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          min-width: 150px;
        }
        .tooltip-label {
          color: #94a3b8;
          margin: 0 0 6px;
          font-weight: 600;
        }
        .tooltip-row {
          margin: 3px 0;
          font-weight: 500;
        }

        /* ── Empty state ── */
        .comparison-empty {
          text-align: center;
          padding: 48px;
          color: #4a5568;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}