const API = '/api';
let currentFilter = 'all';

// ===== HTTP Request Logger =====
const logList = document.getElementById('logList');

function logRequest(method, url, status, duration) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';

  const statusClass = status < 300 ? 's2xx' : status < 500 ? 's4xx' : 's5xx';

  entry.innerHTML = `
    <span class="log-method ${method}">${method}</span>
    <span class="log-url">${url}</span>
    <span class="log-status ${statusClass}">${status}</span>
    <span class="log-time">${duration}ms</span>
  `;

  logList.prepend(entry);
}

// ===== Fetch wrapper that logs requests =====
async function api(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const start = performance.now();

  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const duration = Math.round(performance.now() - start);
  logRequest(method, url, res.status, duration);

  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data;
}

// ===== Toast =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 2500);
}

// ===== Load Stats =====
async function loadStats() {
  try {
    const { data } = await api(`${API}/stats`);
    document.getElementById('statTotal').textContent = data.total;
    document.getElementById('statCompleted').textContent = data.completed;
    document.getElementById('statInProgress').textContent = data.inProgress;
    document.getElementById('statPending').textContent = data.pending;
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
}

// ===== Load Tasks =====
async function loadTasks() {
  const taskList = document.getElementById('taskList');
  try {
    const query = currentFilter !== 'all' ? `?status=${currentFilter}` : '';
    const { data } = await api(`${API}/tasks${query}`);

    if (data.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#128203;</div>
          <p>No tasks found. Add one above!</p>
        </div>`;
      return;
    }

    taskList.innerHTML = data.map(task => `
      <div class="task-item ${task.status === 'completed' ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-check ${task.status === 'completed' ? 'checked' : ''}" 
             onclick="toggleTask(${task.id}, '${task.status}')">
          ${task.status === 'completed' ? '&#10003;' : ''}
        </div>
        <div class="task-body">
          <div class="task-title">${escapeHtml(task.title)}</div>
          ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
        </div>
        <div class="task-meta">
          <span class="badge badge-${task.priority}">${task.priority}</span>
          <span class="badge badge-${task.status}">${task.status}</span>
        </div>
        <button class="task-delete" onclick="deleteTask(${task.id})" title="Delete">&#10005;</button>
      </div>
    `).join('');
  } catch (e) {
    taskList.innerHTML = `<div class="empty-state"><p>Error loading tasks</p></div>`;
    console.error(e);
  }
}

// ===== Escape HTML =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Create Task =====
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;

  try {
    await api(`${API}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, description, priority }),
    });
    showToast('Task created successfully!');
    document.getElementById('taskForm').reset();
    refresh();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// ===== Toggle Task Status =====
async function toggleTask(id, currentStatus) {
  const nextStatus = currentStatus === 'completed' ? 'pending'
    : currentStatus === 'pending' ? 'in-progress'
    : 'completed';

  try {
    await api(`${API}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: nextStatus }),
    });
    showToast(`Task marked as ${nextStatus}`);
    refresh();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ===== Delete Task =====
async function deleteTask(id) {
  try {
    await api(`${API}/tasks/${id}`, { method: 'DELETE' });
    showToast('Task deleted');
    refresh();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ===== Filter Buttons =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadTasks();
  });
});

// ===== Health Check =====
document.getElementById('healthBtn').addEventListener('click', async () => {
  try {
    const { data } = await api(`${API}/health`);
    showToast(`Server healthy — uptime: ${Math.round(data)}s`);
  } catch (err) {
    showToast('Health check failed!', 'error');
  }
});

// ===== Slow Request =====
document.getElementById('slowBtn').addEventListener('click', async () => {
  showToast('Sending slow request... watch Fiddler!');
  try {
    await api(`${API}/slow?ms=2000`);
    showToast('Slow request completed!');
  } catch (err) {
    showToast('Slow request failed!', 'error');
  }
});

// ===== Clear Log =====
document.getElementById('clearLog').addEventListener('click', () => {
  logList.innerHTML = `<div class="log-empty">Log cleared. Make requests to see them here.</div>`;
});

// ===== Refresh =====
function refresh() {
  loadStats();
  loadTasks();
}

// ===== Init =====
refresh();
