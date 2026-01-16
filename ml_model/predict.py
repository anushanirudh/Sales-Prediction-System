import os
import joblib
import pandas as pd

from data_preprocessing import load_data, create_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "saved_model", "model.pkl")

SAFETY_BUFFER = 0.15

def predict_next_month():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model not found. Please run train_model.py first."
        )

    model = joblib.load(MODEL_PATH)

    df = load_data()
    df = create_features(df)

    last_row = df.iloc[-1]
    next_month = last_row["Month"] + pd.DateOffset(months=1)

    input_data = pd.DataFrame({
        "month": [next_month.month],
        "year": [next_month.year],
        "lag_1": [last_row["Quantity Sold"]],
        "lag_12": [df.iloc[-12]["Quantity Sold"]],
        "rolling_3": [df.tail(3)["Quantity Sold"].mean()],
        "Cost Price": [last_row["Cost Price"]],
        "Selling Price": [last_row["Selling Price"]]
    })

    forecast = model.predict(input_data)[0]
    recommended_stock = int(round(forecast * (1 + SAFETY_BUFFER)))

    variance = df["Quantity Sold"].tail(6).std()

    risk = "Low"
    if variance > 30:
        risk = "High"
    elif variance > 15:
        risk = "Medium"

    return {
        "product": last_row["Product"],
        "forecast_month": next_month.strftime("%Y-%m"),
        "predicted_demand": int(round(forecast)),
        "recommended_stock": recommended_stock,
        "risk_level": risk
    }

if __name__ == "__main__":
    result = predict_next_month()
    print("\nPrediction Result")
    print(result)
