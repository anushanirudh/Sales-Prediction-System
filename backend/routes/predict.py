from flask import Blueprint, jsonify
import pandas as pd
import os
import traceback

from models.model_loader import load_model
from services.data_cleaning import clean_data

TRACK_FILE = 'uploads/latest.txt'

predict_bp = Blueprint('predict', __name__)

# LOAD MODEL
try:
    model = load_model()
    print("MODEL LOADED SUCCESSFULLY")
except Exception as e:
    print("MODEL LOAD ERROR:", str(e))
    model = None


@predict_bp.route('/', methods=['POST'])
def predict_next_month():

    try:

        print("\n========== PREDICT API HIT ==========")

        # CHECK latest.txt
        if not os.path.exists(TRACK_FILE):
            return jsonify({
                "error": "No uploaded file found"
            }), 400

        # READ CSV PATH
        with open(TRACK_FILE, 'r') as f:
            file_path = f.read().strip()

        print("CSV PATH:", file_path)

        # CHECK CSV EXISTS
        if not os.path.exists(file_path):
            return jsonify({
                "error": f"CSV file not found: {file_path}"
            }), 400

        # LOAD CSV
        df = pd.read_csv(file_path)

        print("\nCSV LOADED SUCCESSFULLY")
        print(df.head())

        # CLEAN COLUMN NAMES
        df.columns = df.columns.str.strip()

        print("\nCSV COLUMNS:")
        print(df.columns.tolist())

        # REQUIRED COLUMNS
        required_columns = [
            "Month",
            "Product",
            "Quantity",
            "Revenue",
            "Cost_Price",
            "Selling_Price"
        ]

        # CHECK MISSING COLUMNS
        missing_columns = [
            col for col in required_columns
            if col not in df.columns
        ]

        if missing_columns:
            return jsonify({
                "error": f"Missing columns: {missing_columns}"
            }), 400

        # CLEAN DATA
        df = clean_data(df)

        print("\nDATA CLEANED")

        # CONVERT MONTH
        df["Month"] = pd.to_datetime(
            df["Month"],
            format="%Y-%m",
            errors='coerce'
        )

        print("\nMONTH COLUMN CONVERTED")

        # CHECK MODEL
        if model is None:
            return jsonify({
                "error": "Model not loaded"
            }), 500

        recommendations = []
        historical = []

        # HISTORICAL DATA
        for _, row in df.iterrows():

            historical.append({
                "product": row["Product"],
                "month": row["Month"].strftime("%Y-%m"),
                "quantity": int(row["Quantity"]),
                "revenue": float(row["Revenue"])
            })

        # PRODUCT-WISE PREDICTION
        for product in df["Product"].unique():

            print(f"\nPROCESSING PRODUCT: {product}")

            prod_df = df[
                df["Product"] == product
            ].sort_values("Month")

            last_row = prod_df.iloc[-1]

            next_month_date = (
                last_row["Month"] +
                pd.DateOffset(months=1)
            )

            lag_1 = float(last_row["Quantity"])

            lag_12 = (
                float(prod_df.iloc[-12]["Quantity"])
                if len(prod_df) >= 12
                else lag_1
            )

            rolling_3 = float(
                prod_df["Quantity"].tail(3).mean()
            )

            # MODEL INPUT
            X = pd.DataFrame([{
                "month": next_month_date.month,
                "year": next_month_date.year,
                "lag_1": lag_1,
                "lag_12": lag_12,
                "rolling_3": rolling_3,
                "Cost_Price": float(last_row["Cost_Price"]),
                "Selling_Price": float(last_row["Selling_Price"])
            }])

            print("\nMODEL INPUT:")
            print(X)

            # PREDICTION
            prediction = model.predict(X)

            print("RAW PREDICTION:", prediction)

            pred_qty = int(round(float(prediction[0])))

            avg_sales = int(
                round(prod_df["Quantity"].tail(6).mean())
            )

            recommended_qty = int(
                round(pred_qty * 1.1)
            )

            investment = round(
                recommended_qty *
                float(last_row["Cost_Price"]),
                2
            )

            expected_profit = round(
                (
                    float(last_row["Selling_Price"]) -
                    float(last_row["Cost_Price"])
                ) * pred_qty,
                2
            )

            margin = round(
                (
                    (
                        float(last_row["Selling_Price"]) -
                        float(last_row["Cost_Price"])
                    )
                    /
                    float(last_row["Selling_Price"])
                ) * 100,
                2
            )

            recommendations.append({
                "product": product,
                "trend": f"{((lag_1 - avg_sales) / avg_sales) * 100:.0f}%",
                "avg_sales": avg_sales,
                "predicted_demand": pred_qty,
                "recommended_order": recommended_qty,
                "investment": investment,
                "expected_profit": expected_profit,
                "margin": margin,
                "confidence": (
                    "high"
                    if len(prod_df) >= 6
                    else "medium"
                )
            })

        print("\n========== SUCCESS ==========")

        comparison = []

        for item in recommendations:

            comparison.append({
                "product": item["product"],
                "avgSales": item["avg_sales"],
                "predicted": item["predicted_demand"],
                "order": item["recommended_order"],

                "radar": {
                    "Demand": min(item["predicted_demand"], 100),
                    "Profit": min(int(item["margin"]), 100),
                    "Trend %": min(
                        abs(int(item["trend"].replace("%", ""))),
                        100
                    ),
                    "Stock Level": min(
                        int(
                            item["recommended_order"]
                            / max(item["predicted_demand"], 1)
                            * 100
                        ),
                        100
                    ),
                    "Velocity": min(item["avg_sales"], 100)
                }
            })

        return jsonify({
            "recommendations": recommendations,
            "comparison": comparison,
            "historical": historical,
            "trends": historical
        })
           

    except Exception as e:

        print("\n========== ERROR ==========")
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500