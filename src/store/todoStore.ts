// src/store/todoStore.ts
import { create } from "zustand";
import { Todo } from "@/types";
import { getStoredTodos, setStoredTodos } from "@/utils/todo/storage";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

interface TodoStore {
  todos: Todo[];
  fetchTodos: () => void;
  addTodo: (todo: Pick<Todo, "boardId" | "content" | "position">) => void;
  updateTodo: (updatedTodos: Todo[]) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (todos: Todo[]) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],

  fetchTodos: () => {
    const todos = getStoredTodos();
    set({ todos });
  },

  addTodo: (todo) => {
    const newTodo: Todo = {
      id: uuidv4(),
      createdAt: dayjs().toDate(),
      ...todo,
    };
    const updatedTodos = [...get().todos, newTodo];
    setStoredTodos(updatedTodos);
    set({ todos: updatedTodos });
  },

  updateTodo: (updatedTodos) => {
    setStoredTodos(updatedTodos);
    set({ todos: updatedTodos });
  },

  deleteTodo: (id) => {
    const updatedTodos = get().todos.filter((todo) => todo.id !== id);
    setStoredTodos(updatedTodos);
    set({ todos: updatedTodos });
  },

  reorderTodos: (todos) => {
    setStoredTodos(todos);
    set({ todos });
  },
}));
