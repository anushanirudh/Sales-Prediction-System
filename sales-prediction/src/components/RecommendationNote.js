import "./recommend.css";

export default function RecommendationNote() {
  return (
    <div className="note-box">
      <strong>Note:</strong>
      <p>
        Recommendations include a safety stock buffer (10–20%) to prevent
        stockouts. High confidence predictions are based on consistent
        historical patterns. Adjust quantities based on seasonal factors,
        promotions, or market changes.
      </p>
    </div>
  );
}
