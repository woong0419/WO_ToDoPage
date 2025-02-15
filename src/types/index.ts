export interface Todo {
  id: string;
  boardId: string;
  content: string;
  position: number;
  createdAt: Date;
}

export interface Board {
  id: string;
  title: string;
  position: number;
  createdAt: Date;
}
