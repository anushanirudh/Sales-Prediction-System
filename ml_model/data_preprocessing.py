import pandas as pd
import os

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Dataset path
DATA_PATH = os.path.join(BASE_DIR, "data", "sample_sales.csv")


# -------------------------------
# LOAD DATA
# -------------------------------
def load_data():

    # Read dataset
    df = pd.read_csv(DATA_PATH)

    # Clean column names
    df.columns = df.columns.str.strip()

    print("Columns Loaded:")
    print(df.columns)

    return df


# -------------------------------
# FEATURE ENGINEERING
# -------------------------------
def create_features(df):

    # Convert Month column to datetime
    df["Month"] = pd.to_datetime(
        df["Month"],
        format="%Y-%m",
        errors="coerce"
    )

    # Sort product-wise and month-wise
    df = df.sort_values(["Product", "Month"])

    # Extract month & year
    df["month"] = df["Month"].dt.month
    df["year"] = df["Month"].dt.year

    # Previous month sales
    df["lag_1"] = (
        df.groupby("Product")["Quantity"]
        .shift(1)
    )

    # Rolling average of last 3 months
    df["rolling_3"] = (
        df.groupby("Product")["Quantity"]
        .rolling(3)
        .mean()
        .reset_index(level=0, drop=True)
    )

    # Remove null rows created by lag/rolling
    df.dropna(inplace=True)

    # Remove original Month column
    df.drop(columns=["Month"], inplace=True)

    return df


# -------------------------------
# TEST
# -------------------------------
if __name__ == "__main__":

    df = load_data()

    df = create_features(df)

    print("\nProcessed Dataset:")
    print(df.head())
    