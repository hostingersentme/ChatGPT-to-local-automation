from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run-script', methods=['POST'])
def run_script():
    data = request.json
    script_name = data.get('script_name')
    try:
        result = subprocess.run(['python3', script_name], capture_output=True, text=True, check=True)
        app.logger.info(f"Script output: {result.stdout}")
        return jsonify(result=result.stdout)
    except subprocess.CalledProcessError as e:
        app.logger.error(f"Script error: {e.stderr}")
        return jsonify(error=e.stderr), 500
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # Change port to 5001
