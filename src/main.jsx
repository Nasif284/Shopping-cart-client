import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./Error/ErrorBoundary.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./Store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                }}
              >
                <App />
              </PayPalScriptProvider>
            </LocalizationProvider>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
