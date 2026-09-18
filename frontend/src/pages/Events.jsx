import { useState, useEffect } from "react";
import EventForm from "../forms/EventForm";
import DeleteDialog from "../forms/DeleteDialog";
import EventCard from "../components/EventCard";
import moment from "moment";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../utils/events-api";

export function Events() {
  const [eventsRequestHash, setEventsRequestHash] = useState(0);
  const [events, setEvents] = useState([]);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDialog, setCurrentDialog] = useState("");

  useEffect(() => {
    async function get() {
      const events = await getEvents();

      setEvents(events);
    }

    get();
  }, [eventsRequestHash]);

  function openCreateEventDialog() {
    setCurrentEvent(null);
    setCurrentDialog("add");
  }

  function createNewEvent(newEventData) {
    async function create() {
      const newEvent = await createEvent(newEventData);

      setEvents((events) => [...events, newEvent]);
    }

    create();
  }

  function openEditEventDialog(event) {
    setCurrentEvent(event);
    setCurrentDialog("edit");
  }

  function updateExistingEvent(eventData) {
    async function update() {
      const event = await updateEvent(eventData.id, eventData);

      setEvents((events) =>
        [...events].map((oldEvent) =>
          oldEvent.id !== eventData.id ? oldEvent : event,
        ),
      );
    }

    update();
  }

  function openDeleteEventDialog(event) {
    setCurrentEvent(event);
    setCurrentDialog("delete");
  }

  function deleteExistingEvent(id) {
    async function remove() {
      await deleteEvent(id);

      setEvents((events) => [...events].filter((event) => event.id !== id));
    }

    remove();
  }

  function importEvents() {
    // 1. Создаем скрытый элемент ввода файла
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json"; // Ограничиваем выбор текстовыми файлами

    // 2. Слушаем событие выбора файла
    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        // 3. Читаем содержимое файла как текст
        const fileContent = await file.text();
        console.log("Файл успешно прочитан, отправка...");

        // 4. Отправляем текст на сервер
        const response = await fetch("/api/events/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: fileContent,
        });

        if (response.ok) {
          setEventsRequestHash((state) => state + 1);
        } else {
          console.error("Ошибка сервера при отправке:", response.status);
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    });

    // 3. Инициируем клик, чтобы открыть диалоговое окно
    fileInput.click();
  }

  function exportEvents() {
    const code = JSON.stringify(
      [...events].map((event) => {
        return { ...event, id: undefined };
      }),
    );

    const blob = new Blob([code], { type: "text/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "events.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const isEventFormOpen = currentDialog === "add" || currentDialog === "edit";
  const isDeleteEventFormOpen =
    currentDialog === "delete" && currentEvent !== null;

  return (
    <div>
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setCurrentDialog(null);
          setCurrentEvent(null);
        }}
        onSubmitSuccess={(data) => {
          const localMoment = moment(
            `${data.date} ${data.time}`,
            "YYYY-MM-DD HH:mm",
          );
          data.nextMoment = localMoment.toISOString(true);
          if (currentEvent === null) {
            createNewEvent(data);
          } else {
            data.id = currentEvent.id;
            updateExistingEvent(data);
          }
        }}
        event={currentEvent}
      />
      <DeleteDialog
        isOpen={isDeleteEventFormOpen}
        title="Удаление события"
        description={
          currentEvent === null ? null : `событие '${currentEvent.name}'`
        }
        onClose={() => {
          setCurrentDialog(null);
          setCurrentEvent(null);
        }}
        onDelete={() => {
          deleteExistingEvent(currentEvent.id);
        }}
      />
      <div className="mx-4 flex gap-2">
        <div
          className="underline cursor-pointer"
          onClick={openCreateEventDialog}
        >
          Добавить событие
        </div>
        <div
          className="underline cursor-pointer ml-auto"
          onClick={exportEvents}
        >
          Экспорт
        </div>
        <div className="underline cursor-pointer" onClick={importEvents}>
          Импорт
        </div>
      </div>
      <div className="flex flex-col">
        {events.map((e) => {
          return (
            <EventCard
              key={e.id}
              event={e}
              onEdit={openEditEventDialog}
              onDelete={openDeleteEventDialog}
            />
          );
        })}
      </div>
    </div>
  );
}
