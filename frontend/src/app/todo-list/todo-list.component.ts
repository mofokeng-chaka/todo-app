import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';
import {TodoItemComponent} from "../todo-item/todo-item.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  createNewTodo = false;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  createTodo(): void {
    this.createNewTodo = !this.createNewTodo;
  }

  addTodo(): void {
    if (this.newTodoTitle.trim() !== '') {
      const newTodo: Todo = {
        id: 0,  // You can set this to 0 since it will be assigned by the server
        title: this.newTodoTitle,
        description: this.newTodoDescription,
        completed: false
      };
      this.todoService.addTodo(newTodo).subscribe(() => {
        this.newTodoTitle = '';
        this.newTodoDescription = '';
        this.fetchTodos();
        this.createNewTodo = false;
      });
    }
  }

  cancelAdd(): void {
    this.createNewTodo = false;
  }

  editTodo(todo: Todo): void {
    // Set editMode for the selected todo
    todo.editMode = true;
  }

  saveTodo(todo: Todo): void {
    // Save changes and reset editMode
    this.todoService.updateTodo(todo).subscribe(() => {
      todo.editMode = false;
      this.fetchTodos();
    });
  }

  removeTodo(id: number): void {
    this.todoService.removeTodo(id).subscribe(() => this.fetchTodos());
  }

  cancelEdit(todo: Todo): void {
    todo.editMode = false;
  }

  toggleCompleted(todo: Todo): void {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo).subscribe(() => this.fetchTodos());
  }
}
