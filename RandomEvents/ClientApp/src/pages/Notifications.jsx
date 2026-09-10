import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import DeleteDialog from "../forms/DeleteDialog";

export function Notifications() {
  const notifications = useLoaderData();

  const [cachedNotifications, setCachedNotifications] = useState(notifications);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);

  function deleteNotificationFromBackend(id) {
    async function removeFromServer() {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to delete notification");
      }

      setCachedNotifications(
        [...cachedNotifications].filter(
          (notification) => notification.id !== id,
        ),
      );
    }

    removeFromServer();
  }

  return (
    <div>
      <DeleteDialog
        isOpen={isDeleteFormOpen}
        title="Удаление уведомления"
        description={
          currentNotification === null
            ? null
            : `уведомление '${currentNotification.name}'`
        }
        onClose={() => {
          setIsDeleteFormOpen(false);
          setCurrentNotification(null);
        }}
        onDelete={() => {
          deleteNotificationFromBackend(currentNotification.id);
        }}
      />
      <div className="flex flex-col">
        {cachedNotifications.map((e) => {
          return (
            <div
              className="flex flex-col bg-blue-400 p-2.5 m-4 rounded-sm"
              key={e.id}
            >
              <div>{e.moment}</div>
              <div className="text-2xl">{e.name}</div>
              <div>{e.description}</div>
              <div className="flex gap-2">
                <div
                  className="underline cursor-pointer"
                  onClick={() => {
                    setCurrentNotification(e);
                    setIsDeleteFormOpen(true);
                  }}
                >
                  Delete
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
