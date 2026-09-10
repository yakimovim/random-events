import { useEffect, useRef } from "react";

export default function DeleteEventForm({
  isOpen,
  title,
  onClose,
  onClosing,
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
      if (onClosing) {
        onClosing();
      }
    }
  }, [isOpen, onClosing]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto p-5 rounded-lg border border-[#ccc] border-solid"
    >
      <div className="flex mb-3.5 justify-between">
        <h3>{title}</h3>
        <button type="button" className="cursor-pointer" onClick={onClose}>
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
