# Task Manager — Fiddler Interview Demo

A beginner-friendly REST API + Web App built to demonstrate **Fiddler** skills in an interview setting.

## Quick Start

```bash
pip install -r requirements.txt
python server.py
```

Open **http://localhost:3000** in your browser.

---

## What This Project Demonstrates

| Fiddler Concept           | How to Demo It                                                  |
|---------------------------|-----------------------------------------------------------------|
| **Capturing traffic**     | Open Fiddler, then use the app — all HTTP requests appear       |
| **GET requests**          | Load the page or click filter buttons                           |
| **POST requests**         | Add a new task — see the JSON body in Fiddler                   |
| **PUT requests**          | Click a task circle to change its status                        |
| **DELETE requests**       | Click the ✕ button on a task                                    |
| **Status codes**          | 200 OK, 201 Created, 400 Bad Request, 404 Not Found            |
| **Request/Response body** | Inspect JSON payloads in Fiddler's Inspectors panel             |
| **Custom headers**        | Click "Health Check" — response has custom `X-` headers         |
| **Latency/Performance**   | Click "Slow Request" — watch the 2-second delay in the timeline |
| **Query parameters**      | Filter tasks — Fiddler shows `?status=pending` in the URL       |
| **Content-Type header**   | All requests send `application/json`                            |

---

## API Endpoints

| Method   | Endpoint            | Description             |
|----------|---------------------|-------------------------|
| `GET`    | `/api/tasks`        | List all tasks          |
| `GET`    | `/api/tasks/:id`    | Get a single task       |
| `POST`   | `/api/tasks`        | Create a new task       |
| `PUT`    | `/api/tasks/:id`    | Update a task           |
| `DELETE` | `/api/tasks/:id`    | Delete a task           |
| `GET`    | `/api/stats`        | Get dashboard stats     |
| `GET`    | `/api/health`       | Health check + headers  |
| `GET`    | `/api/slow?ms=2000` | Delayed response (test) |

---

## Step-by-Step Interview Walkthrough

### 1. Setup
- Start the server (`npm start`)
- Open **Fiddler Classic** or **Fiddler Everywhere**
- Make sure Fiddler is capturing traffic (F12 or toggle capture)

### 2. Show GET Request
- Open `http://localhost:3000` in browser
- In Fiddler: find the `GET /api/tasks` request
- Click it → go to **Inspectors** → **JSON** tab
- Show the response body with all tasks

### 3. Show POST Request
- Add a new task in the app
- In Fiddler: find the `POST /api/tasks` request
- Show the **Request Body** (JSON with title, description, priority)
- Show the **Response** with status `201 Created`

### 4. Show PUT Request
- Click a task's circle to change its status
- In Fiddler: find the `PUT /api/tasks/:id` request
- Show the JSON body with the new status

### 5. Show DELETE Request
- Delete a task
- In Fiddler: find the `DELETE /api/tasks/:id` request
- Show the `200 OK` response with the deleted task data

### 6. Show Custom Headers
- Click "Health Check" button
- In Fiddler: inspect the **Response Headers**
- Point out: `X-Server-Status`, `X-Task-Count`, `X-API-Version`

### 7. Show Latency
- Click "Slow Request (2s)" button
- In Fiddler: watch the request take ~2 seconds in the timeline
- Explain how Fiddler helps identify slow endpoints

### 8. Show Query Parameters
- Click "Pending" or "Completed" filter
- In Fiddler: show the URL has `?status=pending`
- Explain how query params filter server-side

### 9. Show Error Handling
- Use Fiddler's **Composer** to send a POST to `/api/tasks` with empty body
- Show the `400 Bad Request` response
- Send a GET to `/api/tasks/999` → show `404 Not Found`

---

## Interview Talking Points

- **"I built this REST API specifically to practice with Fiddler"**
- **"Fiddler helps me debug by showing the exact request/response data"**
- **"I use it to verify status codes, headers, and JSON payloads"**
- **"The slow endpoint demonstrates how I'd identify performance issues"**
- **"I also use Fiddler's Composer to test edge cases like missing fields"**

---

## Tech Stack

- **Backend:** Python + Flask
- **Frontend:** Vanilla HTML/CSS/JS (no build step)
- **Storage:** In-memory (resets on server restart)

---

## Project Structure

```
fiddler-demo/
├── server.py          # Flask API server
├── requirements.txt   # Dependencies
├── README.md          # This file
└── public/
    ├── index.html     # App UI
    ├── style.css      # Styles
    └── app.js         # Frontend logic
```
