import { createRoot } from "react-dom/client";

import { Playground } from "./docs/App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(<Playground />);
