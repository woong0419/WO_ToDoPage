// src/store/modalStore.ts
import { create } from "zustand";

type ModalType = "delete";

interface ModalStore {
  isOpen: boolean;
  type: ModalType | null;
  message: string;
  onConfirm: (() => void) | null;
  openModal: (type: ModalType, message: string, onConfirm?: () => void) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  message: "",
  onConfirm: null,
  openModal: (type, message, onConfirm = undefined) =>
    set({
      isOpen: true,
      type,
      message,
      onConfirm,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      type: null,
      message: "",
      onConfirm: null,
    }),
}));
