import { z } from "zod";

const EventSchema = z.object({
  date: z.string().nonempty("Выберите дату"),
  time: z.string().nonempty("Выберите время"),
  name: z
    .string()
    .nonempty("Введите название")
    .min(3, "Строка должна быть не менее 3 символов")
    .max(256, "Строка должна быть не более 256 символов"),
  description: z
    .string()
    .refine(
      (val) => val === "" || val === null || val.length > 3,
      "Строка должна быть не менее 3 символов",
    )
    .max(2048, "Строка должна быть не более 2048 символов"),
  averageDaysOffset: z.coerce
    .bigint("Введите число")
    .refine((val) => !isNaN(Number(val)), "Это должно быть число")
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), "Число должно быть целым")
    .refine((val) => val >= 1, "Число должно быть положительным"),
  daysSpread: z.coerce
    .bigint("Введите число") // Инпуты всегда возвращают строку
    .refine((val) => !isNaN(Number(val)), "Это должно быть число")
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), "Число должно быть целым")
    .refine((val) => val >= 1, "Число должно быть положительным"),
});

export default EventSchema;
