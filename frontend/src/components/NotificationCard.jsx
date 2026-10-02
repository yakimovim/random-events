import { parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
import CardButton from "./CardButton";
import MDEditor from "@uiw/react-md-editor";

export default function NotificationCard({ notification, onDelete }) {
  const notificationMoment = parseISO(notification.moment);

  return (
    <div className="flex flex-col bg-baby-blue-ice p-2.5 m-4 rounded-sm">
      <div>
        📆 {format(notificationMoment, "dd MMMM yyyy", { locale: ru })} 🕑{" "}
        {format(notificationMoment, "HH:mm", { locale: ru })}
      </div>
      <div className="text-2xl mt-2 text-prussian-blue font-semibold">
        {notification.name}
      </div>
      <div className="pt-4 pb-8" data-color-mode="light">
        <MDEditor.Markdown
          source={notification.description}
          style={{
            backgroundColor: "transparent",
            color: "black",
          }}
        />
      </div>
      <div className="flex gap-2 mt-auto">
        <CardButton text="Удалить" onClick={() => onDelete(notification)} />
      </div>
    </div>
  );
}
