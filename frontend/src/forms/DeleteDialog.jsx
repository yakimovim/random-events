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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      dialogClasses="w-1/3"
    >
      <div className="flex flex-col gap-3.5">
        <div className="m-2">
          Вы действительно хотите удалить {description}?
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button
            className="p-2 cursor-pointer bg-prussian-blue text-white rounded-2xl px-4"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="p-2 cursor-pointer bg-prussian-blue text-red-400 rounded-2xl px-4"
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
