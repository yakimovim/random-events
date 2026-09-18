export async function getEvents() {
  const response = await fetch("/api/events");

  if (!response.ok) {
    throw new Error("Невозможно получить список событий");
  }

  const value = await response.json();

  return value;
}

export async function createEvent(eventData) {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...eventData }),
  });

  if (!response.ok) {
    throw new Error("Невозможно создать событие");
  }

  return await response.json();
}

export async function updateEvent(id, eventData) {
  const response = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...eventData }),
  });

  if (!response.ok) {
    throw new Error("Невозможно обновить событие");
  }

  return await response.json();
}

export async function deleteEvent(id) {
  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Невозможно удалить событие");
  }
}
