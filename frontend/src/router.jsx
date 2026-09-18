import { createBrowserRouter } from "react-router-dom";
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
      },
      {
        path: "events",
        element: <Events />,
      },
    ],
  },
]);

export default router;
