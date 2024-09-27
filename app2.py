from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

pipe = pickle.load(open('pipe.pkl', 'rb'))
df = pickle.load(open('df.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html', 
                           companies=df['Company'].unique(),
                           types=df['TypeName'].unique(),
                           cpus=df['Cpu Brand'].unique(),
                           gpus=df['Gpu Brand'].unique(),
                           oses=df['os'].unique())

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    query = np.array([
        data['company'], data['type'], data['ram'], data['weight'],
        1 if data['touchscreen'] == 'Yes' else 0,
        1 if data['ips'] == 'Yes' else 0,
        data['ppi'], data['cpu'], data['hdd'], data['ssd'], data['gpu'], data['os']
    ])
    
    query = query.reshape(1, 12)
    prediction = int(round(np.exp(pipe.predict(query)[0]), -2))
    
    return jsonify({'price': prediction})

if __name__ == '__main__':
    app.run(debug=True)