"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Board, Todo } from "@/types";
import {
  getStoredBoards,
  setStoredBoards,
  updateBoardPositions,
} from "@/utils/board/storage";
import { handleTodoDragEnd } from "@/utils/dnd";
import CreateBoard from "@/components/board/CreateBoard";
import BoardCard from "@/components/board/BoardCard";

import { useTodoStore } from "@/store/todoStore";

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);

  const { todos } = useTodoStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setBoards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;

        const newBoards = arrayMove(items, oldIndex, newIndex);
        const updatedBoards = updateBoardPositions(newBoards); // position 업데이트
        setStoredBoards(updatedBoards);
        return updatedBoards;
      });
    }
  };

  const fetchBoards = () => {
    setBoards(getStoredBoards());
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        if (event.active.data.current?.type === "todo") {
          const todoId = event.active.id;
          const todo = todos.find((t) => t.id === todoId);
          setActiveTodo(todo || null);
        } else if (event.active.data.current?.type === "board") {
          const boardId = event.active.id;
          const board = boards.find((b) => b.id === boardId);
          setActiveBoard(board || null);
        }
      }}
      onDragEnd={(event) => {
        setActiveTodo(null);
        setActiveBoard(null);
        if (event.active.data.current?.type === "todo") {
          handleTodoDragEnd(event);
        } else if (event.active.data.current?.type === "board") {
          handleDragEnd(event);
        }
      }}
    >
      <div className="p-4 flex flex-col gap-4 max-w-7xl mx-auto h-full">
        <div className="flex justify-between items-center">
          <h1>KANBAN TO-DO</h1>
          <CreateBoard onBoardCreate={fetchBoards} />
        </div>
        <div className="flex gap-4 overflow-x-auto flex-grow scrollbar-visible">
          <SortableContext
            items={boards.map((board) => board.id)}
            strategy={horizontalListSortingStrategy}
          >
            {boards.map((board) => (
              <div key={board.id}>
                <BoardCard
                  key={board.id}
                  board={board}
                  onBoardUpdate={fetchBoards}
                />
              </div>
            ))}
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeTodo && (
          <div className="bg-white border rounded-lg shadow-lg p-3">
            {activeTodo.content}
          </div>
        )}
        {activeBoard && (
          <div className="w-72 bg-white rounded-lg shadow-lg opacity-80">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">{activeBoard.title}</h3>
            </div>
            <div className="p-4">
              <BoardCard board={activeBoard} onBoardUpdate={fetchBoards} />
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
