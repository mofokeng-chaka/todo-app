from fastapi.testclient import TestClient
from main import app, TodoDB, database

client = TestClient(app)

def test_create_todo():
  # Test creating a new todo
  response = client.post("/todos", json={"id": 0, "text": "Test Todo"})
  assert response.status_code == 200
  created_todo = response.json()
  assert created_todo["text"] == "Test Todo"
  assert created_todo["completed"] is False
  assert "id" in created_todo

  # Clean up: Delete the created todo
  response = client.delete(f"/todos/{created_todo['id']}")
  assert response.status_code == 200

def test_get_todos():
  # Test getting all todos
  response = client.get("/todos")
  assert response.status_code == 200
  todos = response.json()
  assert isinstance(todos, list)

def test_delete_todo():
  # Create a todo for testing deletion
  response = client.post("/todos", json={"text": "Delete Test Todo"})
  created_todo = response.json()

  # Test getting all todos
  response = client.get("/todos")
  todos_count = len(response.json())

  # Test deleting the todo
  response = client.delete(f"/todos/{created_todo['id']}")
  assert response.status_code == 200
  todos_count_response = response.json()

  assert todos_count_response == todos_count - 1

def test_toggle_completed():
  # Create a todo for testing completion toggle
  response = client.post("/todos", json={"text": "Toggle Test Todo"})
  created_todo = response.json()

  # Test toggling the completion status of the todo
  response = client.patch(f"/todos/{created_todo['id']}")
  assert response.status_code == 200
  toggled_todo = response.json()
  assert toggled_todo["completed"] is True

  # Clean up: Delete the created todo
  response = client.delete(f"/todos/{created_todo['id']}")
  assert response.status_code == 200
