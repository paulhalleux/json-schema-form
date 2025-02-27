import { createRoot } from "react-dom/client";

import { Router } from "./docs/App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(<Router />);
