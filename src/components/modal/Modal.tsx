// src/components/common/Modal.tsx
"use client";

import { useModalStore } from "@/store/modalStore";

export default function Modal() {
  const { isOpen, type, message, onConfirm, closeModal } = useModalStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {type === "delete" ? "삭제 확인" : "확인"}
        </h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          {type === "delete" && (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          )}
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
