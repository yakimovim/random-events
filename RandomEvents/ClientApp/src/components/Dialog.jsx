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
      className="m-auto rounded-lg border border-[#ccc] border-solid"
    >
      <div className="flex p-5 justify-between bg-[#ccc]">
        <h3 className="font-bold text-lg">{title}</h3>
        <button type="button" className="cursor-pointer" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
