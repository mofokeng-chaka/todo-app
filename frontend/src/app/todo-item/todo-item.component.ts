import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todo: Todo | undefined;
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();

  removeTodo(): void {
    if (this.todo?.id) {
      this.remove.emit(this.todo.id);
    }
  }
}
