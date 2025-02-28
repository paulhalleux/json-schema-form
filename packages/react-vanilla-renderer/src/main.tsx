import React from "react";
import { createRoot } from "react-dom/client";
import {
  createPlaygroundElement,
  PlaygroundHTMLElement,
} from "@phalleux/jsf-playground-core";
import { Form, useForm } from "@phalleux/jsf-react";

import { reactVanillaRenderers } from "./renderers";

import "./index.css";

createPlaygroundElement();
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "playground-element": React.DetailedHTMLProps<
        React.HTMLAttributes<PlaygroundHTMLElement>,
        PlaygroundHTMLElement
      >;
    }
  }
}

export function Playground() {
  const form = useForm({
    renderers: reactVanillaRenderers,
  });

  const onMount = (el: PlaygroundHTMLElement) => {
    if (!el) {
      return;
    }

    el.setForm(form);
  };

  return (
    <playground-element ref={onMount}>
      <div className="px-4 py-3">
        <Form form={form} />
      </div>
    </playground-element>
  );
}

createRoot(document.getElementById("root")!).render(<Playground />);
