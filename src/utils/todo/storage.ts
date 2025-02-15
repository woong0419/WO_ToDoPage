import { Todo } from "@/types";

import { STORAGE_KEYS } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const { TODOS } = STORAGE_KEYS;

export const getStoredTodos = (): Todo[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(TODOS);
  return stored ? JSON.parse(stored) : [];
};

export const setStoredTodos = (todos: Todo[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TODOS, JSON.stringify(todos));
};

export const addTodo = (boardId: string, content: string): void => {
  const todos = getStoredTodos();
  const boardTodos = todos.filter((todo) => todo.boardId === boardId);

  const newTodo: Todo = {
    id: uuidv4(),
    boardId,
    content,
    position: boardTodos.length,
    createdAt: dayjs().toDate(),
  };
  setStoredTodos([...todos, newTodo]);
};

export const updateTodo = (todoId: string, content: string): void => {
  const todos = getStoredTodos();
  const updatedTodos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, content } : todo
  );
  setStoredTodos(updatedTodos);
};

export const deleteTodo = (todoId: string): void => {
  const todos = getStoredTodos();
  const updatedTodos = todos.filter((todo) => todo.id !== todoId);
  setStoredTodos(updatedTodos);
};
