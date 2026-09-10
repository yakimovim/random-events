import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import EventForm from "../forms/EventForm";
import DeleteDialog from "../forms/DeleteDialog";
import moment from "moment";

export function Events() {
  const events = useLoaderData();

  const [cachedEvents, setCachedEvents] = useState(events);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDialog, setCurrentDialog] = useState("");

  function addEvent() {
    setCurrentEvent(null);
    setCurrentDialog("add");
  }

  function sendNewEventToBackend(newEventData) {
    async function sendToServer() {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newEventData }),
      });

      if (!response.ok) {
        throw new Error("Unable to create event");
      }

      const newEvent = await response.json();

      setCachedEvents([...cachedEvents, newEvent]);
    }

    sendToServer();
  }

  function sendEditEventToBackend(eventData) {
    async function sendToServer() {
      const response = await fetch(`/api/events/${eventData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...eventData }),
      });

      if (!response.ok) {
        throw new Error("Unable to update event");
      }

      const event = await response.json();

      setCachedEvents(
        [...cachedEvents].map((oldEvent) =>
          oldEvent.id !== eventData.id ? oldEvent : event,
        ),
      );
    }

    sendToServer();
  }

  function deleteEventFromBackend(id) {
    async function removeFromServer() {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to delete event");
      }

      setCachedEvents([...cachedEvents].filter((event) => event.id !== id));
    }

    removeFromServer();
  }

  function editEvent(event) {
    setCurrentEvent(event);
    setCurrentDialog("edit");
  }

  function deleteEvent(event) {
    setCurrentEvent(event);
    setCurrentDialog("delete");
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
          window.location.reload();
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
      [...cachedEvents].map((event) => {
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
            sendNewEventToBackend(data);
          } else {
            data.id = currentEvent.id;
            sendEditEventToBackend(data);
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
          deleteEventFromBackend(currentEvent.id);
        }}
      />
      <div className="mx-4 flex gap-2">
        <div className="underline cursor-pointer" onClick={addEvent}>
          Add event
        </div>
        <div className="underline cursor-pointer" onClick={exportEvents}>
          Export
        </div>
        <div className="underline cursor-pointer" onClick={importEvents}>
          Import
        </div>
      </div>
      <div className="flex flex-col">
        {cachedEvents.map((e) => {
          return (
            <div
              className="flex flex-col bg-blue-400 p-2.5 m-4 rounded-sm"
              key={e.id}
            >
              <div>{e.nextMoment}</div>
              <div className="text-2xl">{e.name}</div>
              <div>{e.description}</div>
              <div>
                Each {e.averageDaysOffset} days +- {e.daysSpread} days
              </div>
              <div className="flex gap-2">
                <div
                  className="underline cursor-pointer"
                  onClick={() => editEvent(e)}
                >
                  Edit
                </div>
                <div
                  className="underline cursor-pointer"
                  onClick={() => deleteEvent(e)}
                >
                  Delete
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
