import { Board } from "@/types";

import { STORAGE_KEYS } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const { BOARDS } = STORAGE_KEYS;
const initialBoards: Board[] = [
  {
    id: uuidv4(),
    title: "To Do",
    position: 0,
    createdAt: dayjs().toDate(),
  },
  {
    id: uuidv4(),
    title: "In Progress",
    position: 1,
    createdAt: dayjs().toDate(),
  },
  {
    id: uuidv4(),
    title: "Done",
    position: 2,
    createdAt: dayjs().toDate(),
  },
];

export const getStoredBoards = (): Board[] => {
  if (typeof window === "undefined") return initialBoards;

  const stored = localStorage.getItem(BOARDS);
  if (!stored) {
    localStorage.setItem(BOARDS, JSON.stringify(initialBoards));
    return initialBoards;
  }

  return JSON.parse(stored);
};

export const setStoredBoards = (boards: Board[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOARDS, JSON.stringify(boards));
};

export const addBoard = (title: string): void => {
  const boards = getStoredBoards();
  const newBoard: Board = {
    id: uuidv4(),
    title,
    position: boards.length,
    createdAt: dayjs().toDate(),
  };
  setStoredBoards([...boards, newBoard]);
};

export const updateBoardPositions = (boards: Board[]): Board[] => {
  return boards.map((board, index) => ({
    ...board,
    position: index,
  }));
};

export const updateBoard = (boardId: string, title: string): void => {
  const boards = getStoredBoards();
  const updatedBoards = boards.map((board) =>
    board.id === boardId ? { ...board, title } : board
  );
  setStoredBoards(updatedBoards);
};

export const deleteBoard = (boardId: string): void => {
  const boards = getStoredBoards();
  const filteredBoards = boards.filter((board) => board.id !== boardId);
  setStoredBoards(filteredBoards);
};
