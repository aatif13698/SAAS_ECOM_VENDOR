import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../src/assets/scss/app.scss";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
// import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import "./server";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
// import "./i18n"


ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          {/* <ToastContainer zIndex={999999} /> */}
          <Toaster zIndex={999999} />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </>
);

// new code
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "simplebar-react/dist/simplebar.min.css";
// import "flatpickr/dist/themes/light.css";
// import "../src/assets/scss/app.scss";
// import { BrowserRouter } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
// import { store, persistor } from "./store"; // Import store and persistor
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

// // Wrap your App component with PersistGate
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <>
//     <BrowserRouter>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <App />
//           <ToastContainer />
//         </PersistGate>
//       </Provider>
//     </BrowserRouter>
//   </>
// );
