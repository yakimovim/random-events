import { useState, useEffect } from "react";
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import DeleteDialog from "../forms/DeleteDialog";
import {
  getNotifications,
  deleteNotification,
} from "../utils/notifications-api";

export function Notifications() {
  const [hubConnection, setHubConnection] = useState(null);
  const [notificationsRequestHash, setNotificationsRequestHash] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("/api/notifications-hub", {
        skipNegotiation: false,
        transport:
          HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .build();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHubConnection(newConnection);
  }, []);

  useEffect(() => {
    if (hubConnection) {
      hubConnection.on("NewNotifications", () => {
        setNotificationsRequestHash((state) => state + 1);
      });

      hubConnection
        .start()
        .then(() => {
          console.log("SignalR connected");
        })
        .catch((e) => {
          console.log("SignalR connection failed", e);
        });

      return () => {
        hubConnection.stop();
      };
    }
  }, [hubConnection]);

  useEffect(() => {
    async function get() {
      const notifications = await getNotifications();

      setNotifications(notifications);
    }

    get();
  }, [notificationsRequestHash]);

  function deleteNotificationFromBackend(id) {
    async function remove() {
      await deleteNotification(id);

      setNotifications((notifications) =>
        [...notifications].filter((notification) => notification.id !== id),
      );
    }

    remove();
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
        {notifications.map((e) => {
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
