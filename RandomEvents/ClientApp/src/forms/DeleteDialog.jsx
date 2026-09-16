import Dialog from "../components/Dialog";

export default function DeleteDialog({
  isOpen,
  onClose,
  onDelete,
  title,
  description,
}) {
  if (!description) {
    return null;
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-3.5 w-2xs">
        <div className="m-2">
          Вы действительно хотите удалить {description}?
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button
            className="p-2 cursor-pointer bg-blue-500 text-white"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="p-2 cursor-pointer bg-blue-500 text-red-700"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </Dialog>
  );
}
