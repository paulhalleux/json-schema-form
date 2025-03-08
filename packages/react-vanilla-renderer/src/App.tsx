import React from "react";

import type { PlaygroundHTMLElement } from "@phalleux/jsf-playground-core";
import {
  CompleteSchemas,
  createPlaygroundElement,
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
    additionalReferences: CompleteSchemas,
    renderers: reactVanillaRenderers,
  });

  const onMount = (el: PlaygroundHTMLElement) => {
    if (!el) {
      return;
    }

    el.setForm(form);
  };

  return (
    <playground-element
      ref={onMount}
      data-name="@phalleux/jsf-react-vanilla-renderer"
    >
      <div className="p-3 overflow-auto">
        <Form form={form} onSubmit={(event) => event.preventDefault()} />
      </div>
    </playground-element>
  );
}
