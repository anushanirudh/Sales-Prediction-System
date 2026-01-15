import "./tabbar.css";

export default function TabBar({ active, setActive }) {
  const tabs = [
    { id: "recommend", label: "Recommendations" },
    { id: "trends", label: "Trends" },
    { id: "compare", label: "Comparison" },
    { id: "history", label: "Historical Data" }
  ];

  return (
    <div className="tabbar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={active === tab.id ? "tab active" : "tab"}
          onClick={() => setActive(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
