import moment from "moment";

export default function NotificationCard({ notification, onDelete }) {
  const notificationMoment = moment(notification.moment);

  return (
    <div className="flex flex-col bg-blue-400 p-2.5 m-4 rounded-sm">
      <div>
        🕑 {notificationMoment.format("DD MMM yyyy")}{" "}
        {notificationMoment.format("HH:mm")}
      </div>
      <div className="text-2xl mt-2">{notification.name}</div>
      <div>{notification.description}</div>
      <div className="flex gap-2">
        <div
          className="underline cursor-pointer mt-2"
          onClick={() => onDelete(notification)}
        >
          Удалить
        </div>
      </div>
    </div>
  );
}
