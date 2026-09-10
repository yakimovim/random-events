import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventSchema from "../models/EventSchema";
import moment from "moment";
import Dialog from "../components/Dialog";

export default function EventForm({ isOpen, onClose, onSubmitSuccess, event }) {
  if (event) {
    event = { ...event };
    event.description = event.description || "";
    const nextMoment = moment(event.nextMoment);
    event.date = nextMoment.format("YYYY-MM-DD");
    event.time = nextMoment.format("HH:mm");
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EventSchema),
    values: event || {},
  });

  // 4. Обработка успешной отправки
  const onFormSubmit = (data) => {
    onSubmitSuccess(data); // Передаем валидные данные родителю
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} onClosing={reset} title="Событие">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-3.5 w-2xs"
      >
        {/* Поле ДАТЫ */}
        <div>
          <label className="block">Дата:</label>
          <input className="w-full" type="date" {...register("date")} />
          <FormError error={errors.date} />
        </div>

        {/* Поле ВРЕМЕНИ */}
        <div>
          <label className="block">Время:</label>
          <input className="w-full" type="time" {...register("time")} />
          <FormError error={errors.time} />
        </div>

        {/* Поле названия */}
        <div>
          <label className="block">Название:</label>
          <input className="w-full" type="text" {...register("name")} />
          <FormError error={errors.name} />
        </div>

        {/* Поле описания */}
        <div>
          <label className="block">Описание:</label>
          <textarea className="w-full" rows="3" {...register("description")} />
          <FormError error={errors.description} />
        </div>

        {/* Поле среднего числа дней до следующего события */}
        <div>
          <label className="block">
            Среднее число дней до следующего события:
          </label>
          <input
            className="w-full"
            type="number"
            {...register("averageDaysOffset")}
          />
          <FormError error={errors.averageDaysOffset} />
        </div>

        {/* Поле разброса дней до следующего события */}
        <div>
          <label className="block">Разброс дней до следующего события:</label>
          <input className="w-full" type="number" {...register("daysSpread")} />
          <FormError error={errors.daysSpread} />
        </div>

        <button type="submit" className="p-2 cursor-pointer">
          Отправить
        </button>
      </form>
    </Dialog>
  );
}

function FormError({ error }) {
  if (!error) {
    return null;
  }

  return <span className="text-red-600 text-xs">{error.message}</span>;
}
