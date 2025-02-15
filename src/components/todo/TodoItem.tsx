// src/components/Todo/TodoItem.tsx
"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types";
import { useTodoStore } from "@/store/todoStore";
import { useModalStore } from "@/store/modalStore";

import Button from "@/components/common/Button";

interface TodoItemProps {
  todo: Todo;
  boardId: string;
}

export default function TodoItem({ todo, boardId }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(todo.content);

  const { todos, updateTodo, deleteTodo } = useTodoStore();
  const { openModal } = useModalStore();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: todo.id,
      data: {
        type: "todo",
        boardId: todo.boardId,
        position: todo.position,
        parentBoardId: boardId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const allTodos = todos;
    const updatedTodos = allTodos.map((t) =>
      t.id === todo.id ? { ...t, content } : t
    );

    updateTodo(updatedTodos);
    setIsEditing(false);
  };

  const deleteClickHandler = () => {
    openModal("delete", "정말로 삭제하시겠습니까?", () => {
      deleteTodo(todo.id);
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border rounded-lg shadow-sm hover:shadow"
    >
      {isEditing ? (
        <form onSubmit={handleUpdate} className="p-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              저장
            </Button>
            <Button
              type="button"
              clickHandler={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-3 flex flex-col items-left justify-between ">
          <div {...attributes} {...listeners} className="cursor-move">
            <span className="block truncate">{todo.content}</span>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              수정
            </button>
            <button
              onClick={deleteClickHandler}
              className="text-sm text-red-600 hover:text-red-900"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
