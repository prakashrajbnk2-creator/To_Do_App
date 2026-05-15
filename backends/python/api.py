from flask import Flask, jsonify, request
from datetime import datetime

app = Flask(__name__)

# Mock database
todos = [
    {"id": 1, "text": "Refactor Repository Pattern", "completed": False, "category": "Architecture"},
    {"id": 2, "text": "Setup Firebase Auth Provider", "completed": True, "category": "Backend"}
]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(todos)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    new_task = {
        "id": int(datetime.now().timestamp()),
        "text": data.get('text'),
        "completed": False,
        "category": data.get('category', 'Task')
    }
    todos.insert(0, new_task)
    return jsonify(new_task), 201

if __name__ == '__main__':
    app.run(port=5000)
