import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./routes/Route";
import AuthProvider from "./contextAPIs/AuthProvider";
import ChatProvider from "./contextAPIs/ChatProvider";
import { RouterProvider } from "react-router-dom";
import PartnerProvider from "./contextAPIs/PartnerProvider";
import RequirementsProvider from "./contextAPIs/RequirementsProvider";
import { SnackbarProvider } from "notistack";
import { LoadScript } from "@react-google-maps/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PartnerProvider>
        <RequirementsProvider>
          <ChatProvider>
            <SnackbarProvider maxSnack={3}>
              <LoadScript
                googleMapsApiKey={import.meta.env.VITE_Google_Api_Key}
              >
                <RouterProvider router={router} />
              </LoadScript>
            </SnackbarProvider>
          </ChatProvider>
        </RequirementsProvider>
      </PartnerProvider>
    </AuthProvider>
  </React.StrictMode>
);
