import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt

from data_preprocessing import load_data, create_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "saved_model", "model.pkl")

def evaluate_model():
    model = joblib.load(MODEL_PATH)

    df = load_data()
    df = create_features(df)

    features = [
        "month",
        "year",
        "lag_1",
        "lag_12",
        "rolling_3",
        "Cost Price",
        "Selling Price"
    ]

    importance = pd.Series(
        model.feature_importances_,
        index=features
    ).sort_values(ascending=False)

    print("\nFeature Importance")
    print(importance)

    importance.plot(kind="bar", title="Feature Importance")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    evaluate_model()
