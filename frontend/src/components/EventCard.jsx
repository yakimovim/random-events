import moment from "moment";
import CardButton from "./CardButton";

export default function EventCard({ event, onEdit, onDelete }) {
  const eventMoment = moment(event.nextMoment);

  return (
    <div className="flex flex-col bg-baby-blue-ice p-2.5 m-4 rounded-sm">
      <div className="flex gap-8">
        <div>
          🕑 {eventMoment.format("DD MMM yyyy")} {eventMoment.format("HH:mm")}
        </div>
        <div>
          Повторять каждые {event.averageDaysOffset} дней ± {event.daysSpread}{" "}
          дня
        </div>
      </div>
      <div className="mt-2 text-2xl text-prussian-blue font-semibold">
        {event.name}
      </div>
      <div className="pt-4 pb-8">{event.description}</div>
      <div className="flex gap-2 mt-auto">
        <CardButton text="Изменить" onClick={() => onEdit(event)} />
        <CardButton text="Удалить" onClick={() => onDelete(event)} />
      </div>
    </div>
  );
}
