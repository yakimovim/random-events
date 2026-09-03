export async function getNotifications() {
  const url = new URL("/api/notifications", window.location);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to get notifications");
  }

  const value = await response.json();

  return value;
}

export async function getEvents() {
  const url = new URL("/api/events", window.location);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to get events");
  }

  const value = await response.json();

  return value;
}
