import { createBrowserRouter } from "react-router-dom";
import { getNotifications, getEvents } from "./utils/loaders.js";
import { Layout } from "./components/Layout.jsx";
import { Events } from "./pages/Events.jsx";
import { Notifications } from "./pages/Notifications.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Notifications />,
        loader: getNotifications,
      },
      {
        path: "events",
        element: <Events />,
        loader: getEvents,
      },
    ],
  },
]);

export default router;
