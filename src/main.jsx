import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./routes/Route";
import AuthProvider from "./contextAPIs/AuthProvider";
import ChatProvider from "./contextAPIs/ChatProvider";
import { RouterProvider } from "react-router-dom";
import PartnerProvider from "./contextAPIs/PartnerProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PartnerProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </PartnerProvider>
    </AuthProvider>
  </React.StrictMode>
);
