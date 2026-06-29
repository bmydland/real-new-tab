import { useState, useCallback } from "react";

export function useToggle(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const onOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onToggle = useCallback(() => setIsOpen((s) => !s), [setIsOpen]);

  return {
    isOpen,
    onClose,
    onOpen,
    onToggle,
  };
}
