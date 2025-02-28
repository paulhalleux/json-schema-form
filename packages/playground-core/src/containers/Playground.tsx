import {
  memo,
  PropsWithChildren,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Outlet, Route, Routes, useParams } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Form, FormState } from "@phalleux/jsf-core";

import { Code, PlaygroundSection, Sidebar } from "../components";
import { SchemaExample, SchemaExampleCategory } from "../types/examples.ts";

type PlaygroundProps = PropsWithChildren<{
  name: string;
  form: Form;
  examples: SchemaExampleCategory["children"];
}>;

export const PlaygroundLayout = memo(function PlaygroundLayout({
  examples,
  name,
}: PlaygroundProps) {
  const { activeExampleId } = useParams<{ activeExampleId: string }>();
  return (
    <div className="app h-screen w-screen flex text-neutral-800">
      <Sidebar
        name={name}
        examples={examples}
        activeExampleId={activeExampleId}
      />
      <div className="p-4 bg-neutral-100 grow grid grid-cols-4 grid-rows-2 gap-2">
        <Outlet />
      </div>
    </div>
  );
});

export const Playground = memo(function Playground(props: PlaygroundProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlaygroundLayout {...props} />}>
          <Route path="/" element={<PlaygroundPage {...props} />} />
          <Route
            path="/example/:activeExampleId?"
            element={<ExamplePage {...props} />}
          />
        </Route>
        <Route
          path="*"
          element={
            <div className="h-screen w-screen flex flex-col items-center justify-center text-md text-neutral-800">
              Not found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
});

const schemaSelector = (state: FormState) => state.schema;
const valueSelector = (state: FormState) => state.value;
const errorsSelector = (state: FormState) => state.errors;

const PlaygroundPage = memo(function PlaygroundPage({
  form,
  children,
}: PlaygroundProps) {
  useEffect(() => {
    form.setSchema({});
  }, [form]);

  return (
    <>
      <PlaygroundSection title="Result" cols={2} rows={2}>
        {children}
      </PlaygroundSection>
      <SchemaDisplay form={form} editable />
      <ValueDisplay form={form} />
      <ErrorsDisplay form={form} />
    </>
  );
});

const ExamplePage = memo(function ExamplePage({
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
    <>
      <PlaygroundSection title="Result" cols={2} rows={2}>
        {children}
      </PlaygroundSection>
      <SchemaDisplay form={form} />
      <ValueDisplay form={form} />
      <ErrorsDisplay form={form} />
    </>
  );
});

const SchemaDisplay = memo(function SchemaDisplay({
  form,
  editable = false,
}: {
  form: Form;
  editable?: boolean;
}) {
  const schema = useFormStore(form, schemaSelector);
  return (
    <PlaygroundSection title="Schema" cols={2} rows={1}>
      <Code
        value={JSON.stringify(schema, null, 2)}
        editable={editable}
        onChange={(value) => {
          try {
            form.setSchema(JSON.parse(value));
          } catch (e) {
            console.error(e);
          }
        }}
      />
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
