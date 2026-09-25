import "./App.css";
import "./i18n.js";
import moment from "moment";
import "moment/dist/locale/ru";
moment.locale("ru");

import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
import router from "./router.jsx";

function App() {
  return (
    // <Provider>
    <RouterProvider router={router} />
    // </Provider>
  );
}

export default App;
