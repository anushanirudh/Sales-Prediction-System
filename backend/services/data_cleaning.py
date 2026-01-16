import pandas as pd

def clean_data(df):
    # 1. Remove duplicate rows
    df = df.drop_duplicates()

    # 2. Remove rows with missing values
    df = df.dropna()

    # 3. Convert Month column to datetime (if exists)
    if 'Month' in df.columns:
        df['Month'] = pd.to_datetime(df['Month'], errors='coerce')

    # 4. Remove rows with wrong month format
    if 'Month' in df.columns:
        df = df.dropna(subset=['Month'])

    # 5. Reset index
    df = df.reset_index(drop=True)

    return df
