// src/components/Todo/TodoList.tsx
"use client";
import { useTodoStore } from "@/store/todoStore";
import { useEffect, useState } from "react";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TodoItem from "@/components/todo/TodoItem";
import Button from "@/components/common/Button";

interface TodoListProps {
  boardId: string;
}

export default function TodoList({ boardId }: TodoListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState("");
  const { fetchTodos, addTodo, todos } = useTodoStore();
  const adlltodos = todos
    .filter((todo) => todo.boardId === boardId)
    .sort((a, b) => a.position - b.position);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const { setNodeRef } = useDroppable({
    id: `board-${boardId}`,
    data: {
      type: "board",
      boardId: boardId,
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    addTodo({
      boardId,
      content: newTodoContent,
      position: adlltodos.length,
    });

    setNewTodoContent("");
    setIsAdding(false);
  };

  return (
    <div ref={setNodeRef} className="p-4" data-board-id={boardId}>
      <SortableContext
        items={adlltodos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {adlltodos.map((todo) => (
            <TodoItem todo={todo} boardId={boardId} key={todo.id} />
          ))}
        </div>
      </SortableContext>

      {isAdding ? (
        <form onSubmit={handleAddTodo} className="mt-4">
          <input
            type="text"
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            placeholder="할 일을 입력하세요"
            className="w-full p-2 border rounded"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </Button>
            <Button
              type="button"
              clickHandler={() => setIsAdding(false)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          + 할 일 추가
        </button>
      )}
    </div>
  );
}
