import { DragEndEvent } from "@dnd-kit/core";

import { useTodoStore } from "@/store/todoStore";

export const handleTodoDragEnd = (event: DragEndEvent) => {
  const { updateTodo, todos: todosData } = useTodoStore.getState();
  const allTodos = todosData;
  const { active, over } = event;
  if (!over) return;

  const todoId = active.id;
  const sourceBoardId = active.data.current?.boardId;
  let destinationBoardId;

  if (over.data.current?.type === "board") {
    // TodoList에 드롭한 경우
    destinationBoardId = over.data.current.boardId;
  } else if (over.data.current?.type === "todo") {
    // 다른 TodoItem에 드롭한 경우
    destinationBoardId = over.data.current.parentBoardId;
  }

  if (!destinationBoardId) return;
  // 같은 보드 내 이동
  if (sourceBoardId === destinationBoardId) {
    if (!over || active.id === over.id) return;

    const todos = todosData
      .filter((todo) => todo.boardId === sourceBoardId)
      .sort((a, b) => a.position - b.position);

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);

    const updatedTodos = allTodos.map((todo) => {
      if (todo.boardId !== sourceBoardId) return todo;
      if (todo.id === active.id) return { ...todo, position: newIndex };
      if (
        oldIndex < newIndex &&
        todo.position <= newIndex &&
        todo.position > oldIndex
      ) {
        return { ...todo, position: todo.position - 1 };
      }
      if (
        oldIndex > newIndex &&
        todo.position >= newIndex &&
        todo.position < oldIndex
      ) {
        return { ...todo, position: todo.position + 1 };
      }
      return todo;
    });

    updateTodo(updatedTodos);
  }
  // 다른 보드로 이동
  else {
    const targetPosition =
      over.data.current?.type === "todo"
        ? allTodos.find((t) => t.id === over.id)?.position ?? 0
        : allTodos.filter((t) => t.boardId === destinationBoardId).length;

    const sourcePosition = active.data.current?.position || 0;

    const updatedTodos = allTodos.map((todo) => {
      // 1. 이동하는 todo 처리
      if (todo.id === todoId) {
        return {
          ...todo,
          boardId: destinationBoardId,
          position: targetPosition,
        };
      }

      // 2. 도착지 보드의 todos position 조정
      if (todo.boardId === destinationBoardId) {
        if (todo.position >= targetPosition) {
          return {
            ...todo,
            position: todo.position + 1,
          };
        }
      }

      // 3. 출발지 보드의 todos position 재계산
      if (todo.boardId === sourceBoardId) {
        if (todo.position > sourcePosition) {
          // 빈자리를 채우기 위해 position을 하나씩 당김
          return {
            ...todo,
            position: todo.position - 1,
          };
        }
      }

      return todo;
    });

    updateTodo(updatedTodos);
  }
};
