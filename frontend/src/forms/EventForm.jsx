import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventSchema from "../models/EventSchema";
import { parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
import Dialog from "../components/Dialog";
import FormField from "../components/FormField";
import MDEditor from "@uiw/react-md-editor";

export default function EventForm({ isOpen, onClose, onSubmitSuccess, event }) {
  if (event) {
    event = { ...event };
    event.description = event.description || "";
    const nextMoment = parseISO(event.nextMoment);
    event.date = format(nextMoment, "yyyy-MM-dd", { locale: ru });
    event.time = format(nextMoment, "HH:mm", { locale: ru });
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onClosing={reset}
      title="Событие"
      dialogClasses="w-1/2"
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-3.5"
      >
        {/* Поле ДАТЫ */}
        <FormField label="Дата:" error={errors.date}>
          <input className="form-input" type="date" {...register("date")} />
        </FormField>

        {/* Поле ВРЕМЕНИ */}
        <FormField label="Время:" error={errors.time}>
          <input className="form-input" type="time" {...register("time")} />
        </FormField>

        {/* Поле названия */}
        <FormField label="Название:" error={errors.name}>
          <input className="form-input" type="text" {...register("name")} />
        </FormField>

        {/* Поле описания */}
        <FormField label="Описание:" error={errors.description}>
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <div data-color-mode="light">
                  <MDEditor value={value} onChange={onChange} />
                </div>
              );
            }}
          />
        </FormField>

        {/* Поле среднего числа дней до следующего события */}
        <FormField
          label="Среднее число дней до следующего события:"
          error={errors.averageDaysOffset}
        >
          <input
            className="form-input"
            type="number"
            {...register("averageDaysOffset")}
          />
        </FormField>

        {/* Поле разброса дней до следующего события */}
        <FormField
          label="Разброс дней до следующего события:"
          error={errors.daysSpread}
        >
          <input
            className="form-input"
            type="number"
            {...register("daysSpread")}
          />
        </FormField>

        <button
          type="submit"
          className="p-2 cursor-pointer bg-prussian-blue text-white rounded-2xl mt-2"
        >
          Отправить
        </button>
      </form>
    </Dialog>
  );
}
