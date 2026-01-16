def calculate_profit(df):

    required_cols = ['Product', 'Cost_Price', 'Selling_Price', 'Quantity']

    for col in required_cols:
        if col not in df.columns:
            raise Exception(f"Missing column: {col}")

    # Calculate profit per row
    df['Profit'] = (df['Selling_Price'] - df['Cost_Price']) * df['Quantity']

    # Convert numpy values to Python int
    total_profit = int(df['Profit'].sum())

    product_profit = (
        df.groupby('Product')['Profit']
        .sum()
        .apply(int)   # 👈 important fix
        .to_dict()
    )

    return {
        "total_profit": total_profit,
        "product_profit": product_profit
    }
