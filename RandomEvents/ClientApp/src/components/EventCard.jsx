import moment from "moment";

export default function EventCard({ event, onEdit, onDelete }) {
  const eventMoment = moment(event.nextMoment);

  return (
    <div className="flex flex-col bg-blue-400 p-2.5 m-4 rounded-sm">
      <div>
        🕑 {eventMoment.format("DD MMM yyyy")} {eventMoment.format("HH:mm")}
      </div>
      <div>
        Повторять каждые {event.averageDaysOffset} дней ± {event.daysSpread} дня
      </div>
      <div className="mt-2 text-2xl">{event.name}</div>
      <div>{event.description}</div>
      <div className="flex gap-2 mt-2">
        <div className="underline cursor-pointer" onClick={() => onEdit(event)}>
          Изменить
        </div>
        <div
          className="underline cursor-pointer"
          onClick={() => onDelete(event)}
        >
          Удалить
        </div>
      </div>
    </div>
  );
}
