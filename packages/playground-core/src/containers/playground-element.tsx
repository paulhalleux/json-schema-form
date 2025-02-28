import { createRoot, Root } from "react-dom/client";
import { Form } from "@phalleux/jsf-core";

import { examples } from "../examples";
import css from "../index.css?inline";
import { SchemaExampleCategory } from "../types/examples.ts";

import { Playground } from "./Playground.tsx";

export class PlaygroundHTMLElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private readonly reactRoot: Root;

  private form: Form | null = null;
  private examples: SchemaExampleCategory["children"] | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = css;
    this.root.appendChild(style);

    const reactContainer = document.createElement("div");
    reactContainer.setAttribute("id", "react-root");
    this.root.appendChild(reactContainer);

    this.reactRoot = createRoot(reactContainer);
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.reactRoot.unmount();
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
      this.reactRoot.render(
        <div className="px-4 py-3">Missing form instance</div>,
      );
      return;
    }

    this.reactRoot.render(
      <Playground
        form={this.form}
        examples={[...(this.examples ?? []), ...examples]}
      >
        <slot />
      </Playground>,
    );
  }
}

export function createPlaygroundElement() {
  if (!customElements.get("playground-element")) {
    customElements.define("playground-element", PlaygroundHTMLElement);
  }
}
