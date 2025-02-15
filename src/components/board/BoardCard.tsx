"use client";

import { useState } from "react";
import { Board } from "@/types";
import { updateBoard, deleteBoard } from "@/utils/board/storage";
import { useSortable } from "@dnd-kit/sortable";
import { useModalStore } from "@/store/modalStore";
import { CSS } from "@dnd-kit/utilities";

import TodoList from "@/components/todo/TodoList";
import Button from "@/components/common/Button";
import { useTodoStore } from "@/store/todoStore";

interface BoardCardProps {
  board: Board;
  onBoardUpdate: () => void;
}

export default function BoardCard({ board, onBoardUpdate }: BoardCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  const { openModal } = useModalStore();

  const { deleteTodo, todos } = useTodoStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: board.id,
    data: {
      type: "board", // type 추가
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleUpdate = () => {
    if (!title.trim()) return;

    updateBoard(board.id, title);
    setIsEditing(false);
    onBoardUpdate();
  };

  const deleteClickHandler = () => {
    openModal("delete", "정말로 삭제하시겠습니까?", () => {
      handleDelete();
    });
  };

  const handleDelete = () => {
    const boardTodos = todos.filter((todo) => todo.boardId === board.id);
    boardTodos.forEach((todo) => deleteTodo(todo.id));
    deleteBoard(board.id);
    onBoardUpdate();
  };

  if (!isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full sm:w-44 md:w-52 lg:w-72 min-h-[200px] bg-white rounded-lg shadow"
      >
        <div className="p-4 border-b">
          <div className="cursor-move" {...listeners} {...attributes}>
            <h2>{title}</h2>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              clickHandler={() => setIsEditing(true)}
              className=" bg-blue-500 text-white  hover:bg-blue-600"
            >
              수정
            </Button>
            <Button
              clickHandler={deleteClickHandler}
              className=" bg-red-500 text-white  hover:bg-red-600"
            >
              삭제
            </Button>
          </div>
        </div>
        <div>
          <TodoList boardId={board.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-44 md:w-52 lg:w-72 p-4 bg-white rounded-lg shadow">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="보드 제목 입력"
        className="w-full p-2 border rounded"
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <Button
          clickHandler={handleUpdate}
          className=" bg-blue-500 text-white  hover:bg-blue-600"
        >
          수정
        </Button>
        <Button
          clickHandler={() => setIsEditing(false)}
          className=" bg-gray-200  hover:bg-gray-300"
        >
          취소
        </Button>
      </div>
    </div>
  );
}
