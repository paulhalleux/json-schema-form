import React from "react";
import { createRoot, type Root } from "react-dom/client";

import type { Form } from "@phalleux/jsf-core";

import { examples } from "../examples";
import css from "../index.css?inline";
import type { SchemaExampleCategory } from "../types/examples.ts";

import { Playground } from "./Playground.tsx";

export class PlaygroundHTMLElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private readonly reactRoot: Root;

  private form: Form | null = null;
  private examples: SchemaExampleCategory["children"] | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.reactRoot = createRoot(this.root);

    const style = document.createElement("style");
    style.textContent = css;
    this.root.appendChild(style);
  }

  connectedCallback() {
    this.render();
  }

  setForm(form: Form) {
    this.form = form;
    this.render();
  }

  setExamples(examples: SchemaExampleCategory["children"]) {
    this.examples = examples;
    this.render();
  }

  render() {
    if (!this.form) {
      return;
    }

    this.reactRoot.render(
      <React.StrictMode>
        <Playground
          name={this.dataset.name ?? "Json Schema Form"}
          form={this.form}
          examples={[...(this.examples ?? []), ...examples]}
        >
          <slot />
        </Playground>
      </React.StrictMode>,
    );
  }
}

export function createPlaygroundElement() {
  if (!customElements.get("playground-element")) {
    customElements.define("playground-element", PlaygroundHTMLElement);
  }
}
