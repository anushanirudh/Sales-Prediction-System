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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function TrendChart({ data }) {
  const colors = [
    "#8b5cf6",
    "#22c55e",
    "#f59e0b",
    "#06b6d4",
    "#ef4444",
    "#ec4899"
  ];

  // Extract months (x-axis)
  const months = [...new Set(data.map(d => d.month))];

  // Group by product
  const grouped = {};
  data.forEach(d => {
    if (!grouped[d.product]) grouped[d.product] = [];
    grouped[d.product].push(d.quantity);
  });

  const datasets = Object.keys(grouped).map((product, i) => ({
    label: product,
    data: grouped[product],
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length],
    tension: 0.4,
    pointRadius: 5,
    fill: false
  }));

  return (
    <Line
      data={{ labels: months, datasets }}
      options={{
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: { y: { beginAtZero: true } }
      }}
    />
  );
}
