import React, { useEffect, useRef, useState } from "react";
import {
  createForm,
  type Form,
  FormState,
  FormStore,
  InitFormOptions,
} from "@phalleux/jsf-core";
import { isEqual } from "lodash";
import { create, UseBoundStore } from "zustand/react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi } from "zustand/vanilla";

import { JsonSchema } from "./components";

declare module "@phalleux/jsf-core" {
  export interface Register {
    store: UseBoundStore<StoreApi<FormState>>;
  }
}

export const createZustandStore = (initialState: FormState): FormStore => {
  return create(() => initialState);
};

export function useForm(options: InitFormOptions = {}) {
  const [form] = useState(() =>
    createForm({ createStore: createZustandStore, ...options }),
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

export function Form({ form, children, ...rest }: FormProps) {
  const schema = form.store((state) => state.schema);

  if (typeof schema !== "object") return null;

  return (
    <FormProvider value={form}>
      <form {...rest}>
        <JsonSchema schema={schema} path="" />
        {children}
      </form>
    </FormProvider>
  );
}
