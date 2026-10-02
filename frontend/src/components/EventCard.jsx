import { parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import CardButton from "./CardButton";
import MDEditor from "@uiw/react-md-editor";

export default function EventCard({ event, onEdit, onDelete }) {
  const eventMoment = parseISO(event.nextMoment);

  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-baby-blue-ice p-2.5 m-4 rounded-sm">
      <div className="flex gap-8">
        <div>
          🕑 {format(eventMoment, "dd MMMM yyyy", { locale: ru })}{" "}
          {format(eventMoment, "HH:mm", { locale: ru })}
        </div>
        <div>
          {t("repeatDays", { count: event.averageDaysOffset })}{" "}
          {t("offsetDays", { count: event.daysSpread })}
        </div>
      </div>
      <div className="mt-2 text-2xl text-prussian-blue font-semibold">
        {event.name}
      </div>
      <div className="pt-4 pb-8" data-color-mode="light">
        <MDEditor.Markdown
          source={event.description}
          style={{
            backgroundColor: "transparent",
            color: "black",
          }}
        />
      </div>
      <div className="flex gap-2 mt-auto">
        <CardButton text="Изменить" onClick={() => onEdit(event)} />
        <CardButton text="Удалить" onClick={() => onDelete(event)} />
      </div>
    </div>
  );
}
