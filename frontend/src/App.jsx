import "./App.css";
import "./i18n.js";

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
