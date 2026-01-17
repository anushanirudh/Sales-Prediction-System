from flask import Flask
from flask_cors import CORS

# Import routes
from routes.upload import upload_bp
from routes.preprocess import preprocess_bp
from routes.profit import profit_bp
from routes.predict import predict_bp




app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Register Blueprints
app.register_blueprint(upload_bp, url_prefix='/upload')
app.register_blueprint(preprocess_bp, url_prefix='/preprocess')
app.register_blueprint(profit_bp, url_prefix='/profit')
app.register_blueprint(predict_bp, url_prefix='/predict')


@app.route('/')
def home():
    return "Backend server is running!"

if __name__ == '__main__':
    app.run(debug=True)
