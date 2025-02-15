// src/components/Board/CreateBoard.tsx
"use client";

import { useState } from "react";
import { addBoard } from "@/utils/board/storage";

interface CreateBoardProps {
  onBoardCreate: () => void;
}

export default function CreateBoard({ onBoardCreate }: CreateBoardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBoard(title);
    setTitle("");
    setIsCreating(false);
    onBoardCreate();
  };

  if (!isCreating) {
    return (
      <div className="w-72 min-h-32 p-4 flex items-center justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className=" w-36 h-min p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          + 새 보드 추가
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-72 min-h-32 p-4 bg-white rounded-lg shadow"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="보드 제목 입력"
        className="w-full p-2 border rounded"
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          추가
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    </form>
  );
}
