# Task Manager

Simple REST API with a basic web interface for managing tasks. Built with Flask and vanilla JavaScript.

## Features

- Create, update, and delete tasks  
- Filter tasks by status  
- View basic statistics  
- Health check endpoint with custom headers  
- Simulated slow endpoint for testing latency  
- JSON-based API communication  

## Quick Start

```bash
pip install -r requirements.txt
python server.py
```

Open in browser:  
http://localhost:3000

## API Endpoints

| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| GET    | /api/tasks          | Get all tasks     |
| GET    | /api/tasks/:id      | Get task by ID    |
| POST   | /api/tasks          | Create new task   |
| PUT    | /api/tasks/:id      | Update task       |
| DELETE | /api/tasks/:id      | Delete task       |
| GET    | /api/stats          | Get stats         |
| GET    | /api/health         | Health check      |
| GET    | /api/slow?ms=2000   | Delayed response  |

## Tech Stack

- Python (Flask)  
- HTML / CSS / JavaScript  
- In-memory storage  

## Project Structure

```
fiddler-demo/
├── server.py
├── requirements.txt
├── README.md
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```
