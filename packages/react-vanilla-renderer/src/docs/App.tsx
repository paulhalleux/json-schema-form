import React from "react";
import {
  createPlaygroundElement,
  PlaygroundHTMLElement,
  SchemaExample,
} from "@phalleux/jsf-playground-core";
import { Form, useForm } from "@phalleux/jsf-react";

import { reactVanillaRenderers } from "../renderers";

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

const examples: SchemaExample[] = [
  {
    id: "string",
    title: "String",
    schema: {
      type: "string",
      title: "String",
      description: "A simple string",
    },
  },
  {
    id: "email",
    title: "Email",
    schema: {
      type: "string",
      title: "Email",
      format: "email",
      description: "A simple email",
    },
  },
];

export function Playground() {
  const form = useForm({
    renderers: reactVanillaRenderers,
  });

  const onMount = (el: PlaygroundHTMLElement) => {
    if (!el) {
      return;
    }

    el.setForm(form);
    el.setExamples(examples);
  };

  return (
    <playground-element ref={onMount}>
      <div className="px-4 py-3">
        <Form form={form} />
      </div>
    </playground-element>
  );
}
