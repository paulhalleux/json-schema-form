import {
  memo,
  PropsWithChildren,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Route, Routes, useParams } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Form } from "@phalleux/jsf-core";
import { FormState } from "@phalleux/jsf-core/src";

import { Code, PlaygroundSection, Sidebar } from "../components";
import { SchemaExample, SchemaExampleCategory } from "../types/examples.ts";

type PlaygroundProps = PropsWithChildren<{
  form: Form;
  examples: SchemaExampleCategory["children"];
}>;

export const Playground = memo(function Playground(props: PlaygroundProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:activeExampleId?"
          element={<PlaygroundContent {...props} />}
        />
      </Routes>
    </BrowserRouter>
  );
});

const schemaSelector = (state: FormState) => state.schema;
const valueSelector = (state: FormState) => state.value;
const errorsSelector = (state: FormState) => state.errors;

const PlaygroundContent = memo(function PlaygroundContent({
  examples,
  children,
  form,
}: PlaygroundProps) {
  const { activeExampleId } = useParams<{ activeExampleId: string }>();

  const example = useMemo(() => {
    if (!activeExampleId) {
      return null;
    }
    return find(examples, activeExampleId);
  }, [activeExampleId, examples]);

  useEffect(() => {
    if (!example) {
      return;
    }
    form.setSchema(example.schema);
  }, [example, form]);

  return (
    <div className="h-screen w-screen flex text-neutral-800">
      <Sidebar examples={examples} activeExampleId={activeExampleId} />
      <div className="p-4 bg-neutral-100 grow grid grid-cols-4 grid-rows-2 gap-2">
        <PlaygroundSection title="Result" cols={2} rows={2}>
          {children}
        </PlaygroundSection>
        <SchemaDisplay form={form} />
        <ValueDisplay form={form} />
        <ErrorsDisplay form={form} />
      </div>
    </div>
  );
});

const SchemaDisplay = memo(function SchemaDisplay({ form }: { form: Form }) {
  const schema = useFormStore(form, schemaSelector);
  return (
    <PlaygroundSection title="Schema" cols={2} rows={1}>
      <Code value={JSON.stringify(schema, null, 2)} />
    </PlaygroundSection>
  );
});

const ValueDisplay = memo(function ValueDisplay({ form }: { form: Form }) {
  const value = useFormStore(form, valueSelector);
  return (
    <PlaygroundSection title="Data" cols={1} rows={1}>
      <Code value={JSON.stringify(value, null, 2)} />
    </PlaygroundSection>
  );
});

const ErrorsDisplay = memo(function ErrorsDisplay({ form }: { form: Form }) {
  const errors = useFormStore(form, errorsSelector);
  return (
    <PlaygroundSection title="Errors" cols={1} rows={1}>
      <Code value={JSON.stringify(errors, null, 2)} />
    </PlaygroundSection>
  );
});

const find = (
  examples: SchemaExampleCategory["children"],
  id: string,
): SchemaExample | null => {
  for (const example of examples) {
    if (!("children" in example) && example.id === id) {
      return example;
    } else if ("children" in example) {
      const found = find(example.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const useFormStore = <S,>(form: Form, selector: (state: FormState) => S) => {
  return useSyncExternalStore(
    form.store.subscribe,
    () => selector(form.store.getState()),
    () => selector(form.store.getState()),
  );
};
