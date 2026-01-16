from flask import Blueprint, request, jsonify
import os

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = 'uploads'
TRACK_FILE = 'uploads/latest.txt'

@upload_bp.route('/', methods=['POST'])
def upload_file():

    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files['file']

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # store filename
    with open(TRACK_FILE, 'w') as f:
        f.write(file_path)

    return jsonify({
        "message": "File uploaded successfully",
        "file_path": file_path
    })
