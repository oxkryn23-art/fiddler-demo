from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import time
import os

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

# In-memory task storage
tasks = [
    {
        'id': 1,
        'title': 'Learn Fiddler Basics',
        'description': 'Understand how to capture HTTP traffic',
        'status': 'completed',
        'priority': 'high',
        'createdAt': datetime.now().isoformat()
    },
    {
        'id': 2,
        'title': 'Inspect GET Requests',
        'description': 'Use Fiddler to inspect GET request headers and response',
        'status': 'in-progress',
        'priority': 'medium',
        'createdAt': datetime.now().isoformat()
    },
    {
        'id': 3,
        'title': 'Test POST Requests',
        'description': 'Create a new task and observe the request body in Fiddler',
        'status': 'pending',
        'priority': 'low',
        'createdAt': datetime.now().isoformat()
    },
]
next_id = 4
start_time = time.time()


# ===== Serve Frontend =====
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')


# ============================================================
# REST API ENDPOINTS — Perfect for demonstrating in Fiddler
# ============================================================

# GET /api/tasks — Fetch all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    status_filter = request.args.get('status')
    priority_filter = request.args.get('priority')

    filtered = tasks[:]
    if status_filter:
        filtered = [t for t in filtered if t['status'] == status_filter]
    if priority_filter:
        filtered = [t for t in filtered if t['priority'] == priority_filter]

    return jsonify({'success': True, 'count': len(filtered), 'data': filtered})


# GET /api/tasks/:id — Fetch a single task
@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    return jsonify({'success': True, 'data': task})


# POST /api/tasks — Create a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    global next_id
    data = request.get_json(silent=True) or {}

    title = (data.get('title') or '').strip()
    if not title:
        return jsonify({'success': False, 'error': 'Title is required'}), 400

    task = {
        'id': next_id,
        'title': title,
        'description': (data.get('description') or '').strip(),
        'status': 'pending',
        'priority': data.get('priority', 'medium'),
        'createdAt': datetime.now().isoformat(),
    }
    next_id += 1
    tasks.append(task)

    return jsonify({'success': True, 'data': task}), 201


# PUT /api/tasks/:id — Update a task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404

    data = request.get_json(silent=True) or {}
    if 'title' in data:
        task['title'] = data['title'].strip()
    if 'description' in data:
        task['description'] = data['description'].strip()
    if 'status' in data:
        task['status'] = data['status']
    if 'priority' in data:
        task['priority'] = data['priority']

    return jsonify({'success': True, 'data': task})


# DELETE /api/tasks/:id — Delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404

    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({'success': True, 'data': task})


# GET /api/stats — Dashboard statistics
@app.route('/api/stats', methods=['GET'])
def get_stats():
    stats = {
        'total': len(tasks),
        'completed': sum(1 for t in tasks if t['status'] == 'completed'),
        'inProgress': sum(1 for t in tasks if t['status'] == 'in-progress'),
        'pending': sum(1 for t in tasks if t['status'] == 'pending'),
        'highPriority': sum(1 for t in tasks if t['priority'] == 'high'),
    }
    return jsonify({'success': True, 'data': stats})


# GET /api/health — Custom headers endpoint (great for Fiddler demo)
@app.route('/api/health', methods=['GET'])
def health_check():
    response = jsonify({
        'status': 'OK',
        'uptime': time.time() - start_time,
        'timestamp': datetime.now().isoformat()
    })
    response.headers['X-Server-Status'] = 'healthy'
    response.headers['X-Task-Count'] = str(len(tasks))
    response.headers['X-API-Version'] = '1.0.0'
    return response


# GET /api/slow — Deliberate slow endpoint (demonstrate latency in Fiddler)
@app.route('/api/slow', methods=['GET'])
def slow_request():
    delay = min(int(request.args.get('ms', 2000)), 5000) / 1000
    time.sleep(delay)
    return jsonify({
        'success': True,
        'message': f'Response delayed by {int(delay * 1000)}ms',
        'delay': int(delay * 1000)
    })


if __name__ == '__main__':
    print('\n[*] Fiddler Demo Server running at http://localhost:3000')
    print('[*] API Base URL: http://localhost:3000/api')
    print('\nEndpoints to inspect in Fiddler:')
    print('  GET    /api/tasks          — List all tasks')
    print('  GET    /api/tasks/:id       — Get single task')
    print('  POST   /api/tasks          — Create task')
    print('  PUT    /api/tasks/:id       — Update task')
    print('  DELETE /api/tasks/:id       — Delete task')
    print('  GET    /api/stats          — Dashboard stats')
    print('  GET    /api/health         — Health check (custom headers)')
    print('  GET    /api/slow?ms=2000   — Slow response (latency test)\n')
    app.run(host='0.0.0.0', port=3000, debug=True)
