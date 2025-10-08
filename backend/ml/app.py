from flask import Flask, request, jsonify
from numpy import nan
import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import SMAIndicator
import yfinance as yf
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("pnl_model.pkl")
@app.route('/health')
def health():
    return "ML API is running!", 200

@app.route('/predict',methods=['POST'])
def predict():
    data = request.get_json()
    symbol = data.get('symbol')

    if not symbol:
            return jsonify({'error':'No symbol provided'}),400
    

    df = yf.download(symbol,period='2mo',interval='1d')

    df.columns=df.columns.get_level_values(0)

    df['RSI_14'] = RSIIndicator(close=df['Close'], window=14).rsi()
    df['SMA_20'] = SMAIndicator(close=df['Close'], window=20).sma_indicator()
    df.dropna(inplace=True)

    if df.empty:
          return jsonify({'error':'Not enough data for prediction'}),400
    

    latest = df[['RSI_14','SMA_20']].iloc[-1].values.reshape(1,-1)
    predicted_return = model.predict(latest)[0]

    return jsonify({
          'symbol':symbol,
          'predicted_return_5d':round(predicted_return,2)
    })

if __name__ == '__main__':
      app.run(debug=True)