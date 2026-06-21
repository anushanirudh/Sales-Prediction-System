# Sales-Prediction-System

## Overview
```
The Sales Prediction System is a Machine Learning-based application that helps shopkeepers forecast future product
demand using historical sales data.The system predicts the quantity required for the upcoming month and provides
profit-based recommendations to support inventory planning and decision-making.
```

## Problem Statement
```
Shopkeepers often face challenges such as:

Overstocking products, leading to wastage and storage costs.
Understocking products, resulting in missed sales opportunities.
Lack of data-driven inventory planning.

This project aims to predict future sales demand and recommend optimal stock quantities using Machine Learning.

```

## Features
```
Upload sales dataset (CSV format)
Automatic data cleaning and preprocessing
Demand forecasting using Machine Learning
Product-wise sales prediction
Safety buffer calculation
Profit estimation
Dashboard for results visualization
```
## Technology
### Frontend 
```
React.js
HTML
CSS
JavaScript
```
### Backend
```
Flask
Python
```

### Machine Learning
```
Pandas
NumPy
Scikit-learn
Random Forest Regressor
```

## Project Structure

```
Sales-prediction-System/
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
├── backend/
│ ├── routes/
│ ├── services/
│ ├── models/
│ ├── utils/
│ └── app.py
├── ml_model/
│ ├── data_preprocessing.py
│ ├── train_model.py
│ ├── predict.py
│ ├── evaluation.py
│ └── saved_model/
└── README.md
```

## Workflow
```
-Upload sales dataset
-Clean and preprocess data
-Generate lag and rolling features
-Train Machine Learning model
-Predict next month demand
-Calculate safety buffer
-Estimate expected profit
-Display recommendations
```

## Machine Learning Model
```
Model Used :
Random Forest Regressor

Features Used:
Month
Year
Previous Month Sales (lag_1)
Rolling 3-Month Average (rolling_3)
Cost_Price
Selling_Price

Target Variable:
Quantity
```
## Future Enhancements

```
-Multi-shop support
-Seasonal demand forecasting
-Automatic model retraining
-Cloud deployment
-Real-time inventory monitoring
-Advanced analytics dashboard
```

## Conclusion
```
The Sales Prediction System provides a data-driven approach to inventory planning by forecasting
future demand and estimating expected profit.The system helps shopkeepers make informed purchasing
decisions, reduce inventory-related losses, and improve overall profitability.
```

