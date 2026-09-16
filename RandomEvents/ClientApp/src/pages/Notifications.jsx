import { useState, useEffect } from "react";
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import DeleteDialog from "../forms/DeleteDialog";
import NotificationCard from "../components/NotificationCard";
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

  function openDeleteNotificationDialog(notification) {
    setCurrentNotification(notification);
    setIsDeleteFormOpen(true);
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
            <NotificationCard
              key={e.id}
              notification={e}
              onDelete={openDeleteNotificationDialog}
            />
          );
        })}
      </div>
    </div>
  );
}
