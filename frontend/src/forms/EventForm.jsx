import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EventSchema from "../models/EventSchema";
import { parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
import Dialog from "../components/Dialog";
import FormField from "../components/FormField";
import MDEditor from "@uiw/react-md-editor";
import DatePicker, { registerLocale } from "react-datepicker";
import { useMemo } from "react";

registerLocale("ru", ru);

export default function EventForm({ isOpen, onClose, onSubmitSuccess, event }) {
  if (event) {
    event = { ...event };
    event.description = event.description || "";
    event.nextMomentDateTime = parseISO(event.nextMoment);
  }

  const defaultDate = useMemo(() => new Date(), []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EventSchema),
    values: event || { nextMomentDateTime: defaultDate, description: "" },
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
        <FormField
          label="Момент срабатывания:"
          error={errors.nextMomentDateTime}
        >
          <Controller
            name="nextMomentDateTime"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <DatePicker
                  className="form-input"
                  locale="ru"
                  showIcon
                  selected={value}
                  onChange={onChange}
                  showTimeSelect
                  dateFormat="dd MMMM yyyy HH:mm"
                  timeFormat="HH:mm"
                  timeIntervals={15}
                />
              );
            }}
          />
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
