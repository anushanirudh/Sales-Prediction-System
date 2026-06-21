from flask import Blueprint, jsonify
import pandas as pd
import os
import traceback

from models.model_loader import load_model
from services.data_cleaning import clean_data

# -------------------------------
# TRACK FILE
# -------------------------------
TRACK_FILE = 'uploads/latest.txt'

# -------------------------------
# BLUEPRINT
# -------------------------------
predict_bp = Blueprint('predict', __name__)

# -------------------------------
# LOAD MODEL
# -------------------------------
try:
    model = load_model()
    print("MODEL LOADED SUCCESSFULLY")

except Exception as e:
    print("MODEL LOAD ERROR:", str(e))
    model = None


# -------------------------------
# PREDICT ROUTE
# -------------------------------
@predict_bp.route('/', methods=['POST'])
def predict_next_month():

    try:

        print("\n========== PREDICT API HIT ==========")

        # -------------------------------
        # CHECK latest.txt
        # -------------------------------
        if not os.path.exists(TRACK_FILE):
            return jsonify({
                "error": "latest.txt not found"
            }), 400

        # -------------------------------
        # READ FILE PATH
        # -------------------------------
        with open(TRACK_FILE, 'r') as f:
            file_path = f.read().strip()

        print("CSV PATH:", file_path)

        # -------------------------------
        # CHECK CSV EXISTS
        # -------------------------------
        if not os.path.exists(file_path):
            return jsonify({
                "error": f"CSV file not found: {file_path}"
            }), 400

        # -------------------------------
        # READ CSV
        # -------------------------------
        df = pd.read_csv(file_path)

        print("\nCSV LOADED")
        print(df.head())

        print("\nCOLUMNS:")
        print(df.columns.tolist())

        # -------------------------------
        # CLEAN COLUMN NAMES
        # -------------------------------
        df.columns = df.columns.str.strip()

        # -------------------------------
        # REQUIRED COLUMNS
        # -------------------------------
        required_columns = [
            "Month",
            "Product",
            "Quantity",
            "Revenue",
            "Cost_Price",
            "Selling_Price"
        ]

        missing = [
            col for col in required_columns
            if col not in df.columns
        ]

        if missing:
            return jsonify({
                "error": f"Missing columns: {missing}"
            }), 400

        # -------------------------------
        # CLEAN DATA
        # -------------------------------
        df = clean_data(df)

        print("\nDATA CLEANED")

        # -------------------------------
        # CONVERT MONTH
        # -------------------------------
        df["Month"] = pd.to_datetime(
            df["Month"],
            format="%Y-%m",
            errors='coerce'
        )

        print("\nMONTH CONVERTED")

        # -------------------------------
        # CHECK MODEL
        # -------------------------------
        if model is None:
            return jsonify({
                "error": "Model not loaded"
            }), 500

        # -------------------------------
        # STORE RESULTS
        # -------------------------------
        recommendations = []

        # -------------------------------
        # PRODUCT-WISE PREDICTION
        # -------------------------------
        for product in df["Product"].unique():

            print(f"\nPROCESSING PRODUCT: {product}")

            # Filter product
            prod_df = df[
                df["Product"] == product
            ].sort_values("Month")

            # Last row
            last_row = prod_df.iloc[-1]

            # Next month
            next_month_date = (
                last_row["Month"] + pd.DateOffset(months=1)
            )

            # Previous month sales
            lag_1 = float(last_row["Quantity"])

            # Rolling average
            rolling_3 = float(
                prod_df["Quantity"].tail(3).mean()
            )

            # -------------------------------
            # MODEL INPUT
            # -------------------------------
            X = pd.DataFrame([{
                "month": next_month_date.month,
                "year": next_month_date.year,
                "lag_1": lag_1,
                "rolling_3": rolling_3,
                "Cost_Price": float(last_row["Cost_Price"]),
                "Selling_Price": float(last_row["Selling_Price"])
            }])

            print("\nMODEL INPUT:")
            print(X)

            # -------------------------------
            # PREDICT
            # -------------------------------
            prediction = model.predict(X)

            print("PREDICTION:", prediction)

            pred_qty = int(
                round(float(prediction[0]))
            )

            # -------------------------------
            # BUFFER
            # -------------------------------
            buffer_percent = 0.10

            buffer_qty = int(
                round(pred_qty * buffer_percent)
            )

            final_quantity = pred_qty + buffer_qty

            # -------------------------------
            # PROFIT
            # -------------------------------
            profit_per_unit = (
                float(last_row["Selling_Price"])
                - float(last_row["Cost_Price"])
            )

            expected_profit = (
                final_quantity * profit_per_unit
            )

            # -------------------------------
            # STORE RESULT
            # -------------------------------
            recommendations.append({

                "product": product,

                "predicted_demand": pred_qty,

                "buffer_added": buffer_qty,

                "recommended_quantity": final_quantity,

                "profit_per_unit": round(
                    profit_per_unit, 2
                ),

                "expected_profit": round(
                    expected_profit, 2
                )
            })

        print("\nSUCCESS")

        # -------------------------------
        # FINAL RESPONSE
        # -------------------------------
        return jsonify({
            "recommendations": recommendations
        })

    except Exception as e:

        print("\n========= FULL ERROR =========")
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500