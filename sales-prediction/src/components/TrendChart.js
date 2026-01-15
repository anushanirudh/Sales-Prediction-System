import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { months, trendData } from "../services/trendsdata";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function TrendChart() {
  const colors = ["#8b5cf6","#22c55e","#f59e0b","#06b6d4","#ef4444","#ec4899"];

  const datasets = Object.keys(trendData).map((key, i) => ({
    label: key,
    data: trendData[key],
    borderColor: colors[i],
    backgroundColor: colors[i],
    tension: 0.4,
    fill: false,
    pointRadius: 5
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
