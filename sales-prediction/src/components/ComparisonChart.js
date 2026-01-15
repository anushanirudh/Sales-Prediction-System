import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function ComparisonChart({ data }) {
  const labels = data.map(d =>
    d.product
      .replace("(kg)", "")
      .replace("(L)", "")
      .replace("(jar)", "")
      .replace("(box)", "")
      .trim()
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Sales",
        data: data.map(d => d.avg),
        backgroundColor: "#6b7280",
        borderRadius: 6
      },
      {
        label: "Predicted Demand",
        data: data.map(d => d.predicted),
        backgroundColor: "#8b5cf6",
        borderRadius: 6
      },
      {
        label: "Recommended Order",
        data: data.map(d => d.recommended),
        backgroundColor: "#06b6d4",
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
