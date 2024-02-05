from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, insert, Text
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from pydantic import BaseModel
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

app = FastAPI()

origins = ["*"]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./todos.db"

database = Database(DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base: DeclarativeMeta = declarative_base()


class TodoDB(Base):
  __tablename__ = "todos"
  id = Column(Integer, primary_key=True)
  title = Column(String)
  description = Column(String, nullable=True)
  completed = Column(Boolean, default=False)


Todo = sqlalchemy_to_pydantic(TodoDB)


# @app.add_event_handler("startup")
async def startup_db():
  Base.metadata.create_all(bind=engine)
  await database.connect()


# @app.add_event_handler("shutdown")
async def shutdown_db():
  await database.disconnect()


app.add_event_handler("startup", startup_db)
app.add_event_handler("shutdown", shutdown_db)


class TodoCreate(BaseModel):
  title: str
  description: str | None = None


@app.post("/todos", response_model=Todo, summary="Create a new todo",
          description="Create a new todo with the given text.")
async def create_todo(todo: TodoCreate):
  last_record_id = await database.execute(insert(TodoDB), {"title": todo.title, "description": todo.description, "completed": False})
  created_todo = await database.fetch_one(TodoDB.__table__.select().where(TodoDB.id == last_record_id))
  return created_todo


@app.get("/todos", response_model=list[Todo], summary="Get all todos", description="Get a list of all todos.")
async def get_todos():
  query = TodoDB.__table__.select()
  return await database.fetch_all(query)


@app.delete("/todos/{todo_id}", summary="Delete a todo", description="Delete a todo by its ID.")
async def delete_todo(todo_id: int):
  query = TodoDB.__table__.delete().where(TodoDB.id == todo_id)
  deleted_todo = await database.execute(query)
  if not deleted_todo:
    raise HTTPException(status_code=404, detail="Todo not found")
  return deleted_todo


@app.patch("/todos/{todo_id}", response_model=Todo, summary="Toggle todo completion",
           description="Toggle the completion status of a todo.")
async def toggle_completed(todo_id: int):
  query = TodoDB.__table__.select().where(TodoDB.id == todo_id)
  todo = await database.fetch_one(query)
  if not todo:
    raise HTTPException(status_code=404, detail="Todo not found")
  completed = not todo['completed']
  query = TodoDB.__table__.update().where(TodoDB.id == todo_id).values(completed=1 if completed else 0)
  await database.execute(query)
  return {**todo, "completed": completed}
