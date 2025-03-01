import React, { useEffect, useMemo, useRef, useState } from "react";
import { isEqual } from "lodash";
import { create } from "zustand/react";
import { useShallow } from "zustand/react/shallow";

import type {
  BaseRendererProps,
  Form,
  FormState,
  FormStore,
  InitFormOptions,
} from "@phalleux/jsf-core";
import { createForm } from "@phalleux/jsf-core";

import { allOfRenderer } from "../renderers/all-of-renderer.tsx";
import { objectRenderer } from "../renderers/object-renderer.tsx";
import { refRenderer } from "../renderers/ref-renderer.tsx";

export const createZustandStore = (initialState: FormState): FormStore => {
  return create(() => initialState);
};

const BUILT_IN_RENDERERS = [allOfRenderer, refRenderer, objectRenderer];

export function useForm(options: InitFormOptions = {}) {
  const [form] = useState(() =>
    createForm({
      createStore: createZustandStore,
      ...options,
      renderers: [...(options.renderers ?? []), ...BUILT_IN_RENDERERS],
    }),
  );

  const prevSchema = useRef(options.schema);
  useEffect(() => {
    if (!isEqual(options.schema, prevSchema.current)) {
      form.setSchema(options.schema ?? {});
      prevSchema.current = options.schema ?? {};
    }
  }, [form, options.schema]);

  return form;
}

export const FormProvider = React.createContext<Form | null>(null);

export function useFormInstance() {
  const context = React.use(FormProvider);
  if (!context) {
    throw new Error("useJsfContext must be used within a JsfProvider");
  }
  return context as Form;
}

export function useStore<S>(selector: (state: FormState, form: Form) => S) {
  const jsf = useFormInstance();
  return jsf.store(useShallow((state) => selector(state, jsf)));
}

export type FormProps = {
  form: Form;
} & React.ComponentProps<"form">;

export const RenderSchema = ({
  schema,
  path,
  parentSchema,
  previousRenderers,
}: BaseRendererProps) => {
  const instance = useFormInstance();
  const Renderer = useMemo(() => {
    return instance.getRenderer(schema, previousRenderers);
  }, [instance, previousRenderers, schema]);

  if (!Renderer) return "No renderer found";

  return (
    <Renderer
      schema={schema}
      path={path}
      parentSchema={parentSchema}
      previousRenderers={previousRenderers}
    />
  );
};

export function Form({ form, children, ...rest }: FormProps) {
  const schema = form.store((state) => state.schema);

  if (typeof schema !== "object") return null;

  return (
    <FormProvider value={form}>
      <form {...rest}>
        <RenderSchema
          schema={schema}
          path=""
          parentSchema={undefined}
          previousRenderers={[]}
        />
        {children}
      </form>
    </FormProvider>
  );
}
