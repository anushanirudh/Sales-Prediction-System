from flask import Blueprint, jsonify
import pandas as pd
import os
from services.data_cleaning import clean_data

TRACK_FILE = 'uploads/latest.txt'

preprocess_bp = Blueprint('preprocess', __name__)

@preprocess_bp.route('/', methods=['GET'])
def preprocess_data():

    if not os.path.exists(TRACK_FILE):
        return jsonify({"error": "No file uploaded"}), 400

    with open(TRACK_FILE, 'r') as f:
        file_path = f.read()

    df = pd.read_csv(file_path)
    cleaned_df = clean_data(df)

    return jsonify({
        "message": "Data cleaned successfully",
        "rows": len(cleaned_df)
    })
