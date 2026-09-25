import moment from "moment";
import CardButton from "./CardButton";

export default function NotificationCard({ notification, onDelete }) {
  const notificationMoment = moment(notification.moment);

  return (
    <div className="flex flex-col bg-baby-blue-ice p-2.5 m-4 rounded-sm">
      <div>
        🕑 {notificationMoment.format("DD MMMM yyyy")}{" "}
        {notificationMoment.format("HH:mm")}
      </div>
      <div className="text-2xl mt-2 text-prussian-blue font-semibold">
        {notification.name}
      </div>
      <div className="pt-4 pb-8">{notification.description}</div>
      <div className="flex gap-2 mt-auto">
        <CardButton text="Удалить" onClick={() => onDelete(notification)} />
      </div>
    </div>
  );
}
