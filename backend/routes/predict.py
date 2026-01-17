from flask import Blueprint, jsonify
import pandas as pd
import os
import numpy as np

from models.model_loader import load_model
from services.data_cleaning import clean_data

TRACK_FILE = 'uploads/latest.txt'

predict_bp = Blueprint('predict', __name__)
model = load_model()

@predict_bp.route('/', methods=['GET'])
def predict_next_month():

    if not os.path.exists(TRACK_FILE):
        return jsonify({"error": "No file uploaded"}), 400

    with open(TRACK_FILE, 'r') as f:
        file_path = f.read().strip()

    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()
    df = clean_data(df)

    df["Month"] = pd.to_datetime(df["Month"], format="%Y-%m", errors='coerce')

    results = []

    for product in df["Product"].unique():

        prod_df = df[df["Product"] == product].sort_values("Month")

        last_row = prod_df.iloc[-1]
        next_month_date = last_row["Month"] + pd.DateOffset(months=1)

        # --- ML Features ---
        lag_1 = float(last_row["Quantity"])
        lag_12 = float(prod_df.iloc[-12]["Quantity"]) if len(prod_df) >= 12 else lag_1
        rolling_3 = float(prod_df["Quantity"].tail(3).mean())

        X = pd.DataFrame([{
            "month": next_month_date.month,
            "year": next_month_date.year,
            "lag_1": lag_1,
            "lag_12": lag_12,
            "rolling_3": rolling_3,
            "Cost_Price": float(last_row["Cost_Price"]),
            "Selling_Price": float(last_row["Selling_Price"])
        }])

        pred_qty = int(round(float(model.predict(X)[0])))

        # --- BUSINESS METRICS ---
        avg_sales = int(round(prod_df["Quantity"].tail(6).mean()))

        trend_pct = ((lag_1 - avg_sales) / avg_sales) * 100

        recommended_qty = int(round(pred_qty * 1.1))  # 10% buffer

        investment = round(recommended_qty * float(last_row["Cost_Price"]), 2)

        profit = (float(last_row["Selling_Price"]) -
                  float(last_row["Cost_Price"])) * pred_qty

        margin = round(
            ((float(last_row["Selling_Price"]) -
              float(last_row["Cost_Price"])) /
             float(last_row["Selling_Price"])) * 100, 2)

        confidence = "high" if len(prod_df) >= 6 else "medium"

        results.append({
            "product": product,
            "trend": f"{trend_pct:.0f}%",
            "avg_sales": avg_sales,
            "predicted_demand": pred_qty,
            "recommended_order": recommended_qty,
            "investment": investment,
            "expected_profit": round(profit, 2),
            "margin": margin,
            "confidence": confidence
        })

    return jsonify({
        "message": "Smart forecast generated",
        "forecast": results
    })
