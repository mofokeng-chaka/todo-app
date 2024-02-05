export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  editMode?: boolean;  // New property to track edit mode
}
