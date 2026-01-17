import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "sample_sales.csv")

def load_data():
    df = pd.read_csv(DATA_PATH)

    # 🔥 clean column names
    df.columns = df.columns.str.strip()

    print("COLUMNS AFTER LOAD:", df.columns)  # debug

    return df

def create_features(df):

    # Use Month
    df["Month"] = pd.to_datetime(df["Month"], format="%Y-%m", errors='coerce')

    # Extract numeric features
    df["month"] = df["Month"].dt.month
    df["year"] = df["Month"].dt.year

    # Lag features
    df["lag_1"] = df["Quantity"].shift(1)
    df["lag_12"] = df["Quantity"].shift(12)
    df["rolling_3"] = df["Quantity"].rolling(3).mean()

    df.dropna(inplace=True)

    # REMOVE Month permanently
    df.drop(columns=["Month"], inplace=True)

    return df

