import "./App.css";
import "./i18n.js";
import moment from "moment";
import "moment/dist/locale/ru";
moment.locale("ru");

import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
