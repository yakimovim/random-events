import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import "./i18n.js";

import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
