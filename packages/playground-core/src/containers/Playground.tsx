import React, {
  memo,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Outlet, Route, Routes, useParams } from "react-router";
import { BrowserRouter } from "react-router-dom";

import type { Form, FormState } from "@phalleux/jsf-core";

import { Code, PlaygroundSection, Sidebar } from "../components";
import { CheckedInput } from "../components/CheckedInput.tsx";
import type {
  SchemaExample,
  SchemaExampleCategory,
} from "../types/examples.ts";

type PlaygroundProps = PropsWithChildren<{
  name: string;
  form: Form;
  examples: SchemaExampleCategory["children"];
}>;

export const PlaygroundLayout = memo(function PlaygroundLayout({
  form,
  examples,
  name,
}: PlaygroundProps) {
  const { activeExampleId } = useParams<{ activeExampleId: string }>();

  const debug = useFormStore(form, (_, form) => form.getFlag("debug") ?? false);

  return (
    <div className="app h-screen w-screen flex text-neutral-800">
      <Sidebar
        name={name}
        examples={examples}
        activeExampleId={activeExampleId}
      />
      <div className="flex flex-col w-full">
        <div className="px-4 flex items-center bg-white border-b border-neutral-300 h-12 shrink-0">
          <CheckedInput
            value={debug}
            onChange={(value) => form.setFlag("debug", value)}
            label="Debug"
          />
        </div>
        <div className="p-4 bg-neutral-100 grow grid grid-cols-4 grid-rows-2 gap-2 min-h-0">
          <Outlet />
        </div>
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

const valueSelector = (state: FormState) => state.value;
const schemaSelector = (state: FormState) =>
  JSON.stringify(state.schema.toJSON(), null, 2);
const schemaDerefSelector = (state: FormState) =>
  JSON.stringify(state.schema.toDereferenced().toMergedJSON(), null, 2);
const schemaDeepDerefSelector = (state: FormState) =>
  JSON.stringify(state.schema.toDeepDereferencedJSON(), null, 2);

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

const MODES = ["default", "dereferenced", "deep-dereferenced"] as const;
const SchemaDisplay = memo(function SchemaDisplay({
  form,
  editable = false,
}: {
  form: Form;
  editable?: boolean;
}) {
  const [mode, setMode] = useState<(typeof MODES)[number]>("default");

  const schemaDefault = useFormStore(form, schemaSelector);
  const schemaDeref = useFormStore(form, schemaDerefSelector);
  const schemaDeepDeref = useFormStore(form, schemaDeepDerefSelector);

  const modeToSchema = {
    default: schemaDefault,
    dereferenced: schemaDeref,
    "deep-dereferenced": schemaDeepDeref,
  };

  const onClick = (mode: (typeof MODES)[number]) => {
    setMode(mode);
  };

  return (
    <PlaygroundSection title="Schema" cols={2} rows={1}>
      {!editable && (
        <div className="border-b border-neutral-300 p-1 flex gap-1">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => onClick(m)}
              className={`text-xs border border-neutral-300 rounded px-1 py-0.5 pt-1 cursor-pointer hover:bg-neutral-200 ${
                m === mode ? "bg-neutral-200" : ""
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
      <div className="h-full min-h-0">
        <Code
          value={editable ? schemaDefault : modeToSchema[mode]}
          editable={editable}
          onChange={(value) => {
            if (!editable) return;
            try {
              form.setSchema(JSON.parse(value));
            } catch (e) {
              console.error(e);
            }
          }}
        />
      </div>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorsDisplay = memo(function ErrorsDisplay({ form }: { form: Form }) {
  return (
    <PlaygroundSection title="Errors" cols={1} rows={1}>
      <Code value={JSON.stringify({}, null, 2)} />
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

const useFormStore = <S,>(
  form: Form,
  selector: (state: FormState, form: Form) => S,
) => {
  return useSyncExternalStore(
    form.store.subscribe,
    () => selector(form.store.getState(), form),
    () => selector(form.store.getState(), form),
  );
};
