from flask import Blueprint, jsonify
import pandas as pd
from services.profit_calculation import calculate_profit
import os

TRACK_FILE = 'uploads/latest.txt'

profit_bp = Blueprint('profit', __name__)

@profit_bp.route('/', methods=['GET'])
def profit_data():

    if not os.path.exists(TRACK_FILE):
        return jsonify({"error": "No file uploaded"}), 400

    with open(TRACK_FILE, 'r') as f:
        file_path = f.read()

    df = pd.read_csv(file_path)
    result = calculate_profit(df)

    return jsonify({
        "message": "Profit calculated successfully",
        "total_profit": result["total_profit"],
        "product_profit": result["product_profit"]
    })
