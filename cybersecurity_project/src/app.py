from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    # Add detection logic here
    return jsonify({'status': 'success', 'data': data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
