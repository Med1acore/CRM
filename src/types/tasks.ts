// src/types/tasks.ts
export type Card = {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  position: number;
  created_at?: string;
  // TODO: Add assignees later
};

export type List = {
  id: string;
  board_id: string;
  name: string;
  position: number;
  cards: Card[];
};

export type Board = {
  id: string;
  name: string;
  created_at?: string;
};

export type CardAssignee = {
  card_id: string;
  user_id: string;
};
