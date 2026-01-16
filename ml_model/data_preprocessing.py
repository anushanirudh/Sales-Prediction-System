import pandas as pd
import os

# Absolute base directory (ml_model/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "data", "sample_sales_with_profit.csv")

def load_data():
    df = pd.read_csv(DATA_PATH)
    df["Month"] = pd.to_datetime(df["Month"])
    df.sort_values("Month", inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df

def create_features(df):
    df["month"] = df["Month"].dt.month
    df["year"] = df["Month"].dt.year

    df["lag_1"] = df["Quantity Sold"].shift(1)
    df["lag_12"] = df["Quantity Sold"].shift(12)
    df["rolling_3"] = df["Quantity Sold"].rolling(window=3).mean()

    df.dropna(inplace=True)
    return df
