import React from "react";
import { createRoot } from "react-dom/client";

import { Playground } from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>,
);
