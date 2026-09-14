export async function getNotifications() {
  const response = await fetch("/api/notifications");

  if (!response.ok) {
    throw new Error("Невозможно получить список увеломлений");
  }

  const value = await response.json();

  return value;
}

export async function deleteNotification(id) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Невозможно удалить уведомление");
  }
}
