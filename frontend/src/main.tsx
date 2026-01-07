import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store";

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.classList.remove("light", "dark");
document.documentElement.classList.add(savedTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
