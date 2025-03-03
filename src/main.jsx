import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { ThemeProviderWrapper } from "./ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProviderWrapper>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProviderWrapper>
  </BrowserRouter>
);
