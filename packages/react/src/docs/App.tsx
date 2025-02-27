import { useMemo } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { javascript } from "@codemirror/lang-javascript";
import { JSONSchema } from "@phalleux/jsf-core";
import { vscodeLightInit } from "@uiw/codemirror-theme-vscode/src/light.ts";
import CodeMirror from "@uiw/react-codemirror";
import { get } from "lodash";

import { Form, useForm } from "../adapter";

import { ExampleListCategory } from "./components/ExampleListCategory.tsx";
import jsonSchemas from "./schemas.ts";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:examplePath?" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export function App() {
  const { examplePath } = useParams<{ examplePath: string }>();
  const schema = useMemo(() => {
    if (!examplePath) {
      return null;
    }
    return get(jsonSchemas, examplePath);
  }, [examplePath]);

  return (
    <div className="bg-neutral-100 flex h-screen">
      <div className="border-r w-80 border-neutral-300 bg-white overflow-hidden flex flex-col">
        <header className="">
          <h1 className="font-bold text-sm px-4 pt-4 text-neutral-700">
            Examples
          </h1>
        </header>
        <div className="overflow-y-auto h-full p-2 gap-1 flex flex-col">
          {jsonSchemas.map((category, index) => (
            <ExampleListCategory
              key={category.categoryName}
              path={`[${index}]`}
              selectedSchemaPath={examplePath}
              category={category}
            />
          ))}
        </div>
      </div>
      {schema && <SchemaDemo schema={schema} />}
    </div>
  );
}

const theme = vscodeLightInit({
  theme: "light",
  settings: {
    fontSize: "14px",
  },
});
const ext = [javascript()];

export function SchemaDemo({ schema }: { schema: JSONSchema | null }) {
  const form = useForm({
    schema: schema ?? {},
  });

  const value = form.store((state) => state.value);
  const formSchema = form.store((state) => state.schema);
  const errors = form.store((state) => state.errors);

  return (
    <div className="p-4 grid grid-cols-2 grid-rows-2 gap-4 w-full">
      <div className="col-span-1 row-span-2 flex flex-col gap-1">
        <h1 className="text-sm font-medium">{schema?.title}</h1>
        <div className="col-span-1 row-span-2 border p-4 border-neutral-300 rounded bg-white grow">
          <Form
            form={form}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Schema</h2>
        <div className="overflow-hidden col-span-1 row-span-1 border border-neutral-300 rounded bg-white grow">
          <CodeMirror
            theme={theme}
            extensions={ext}
            height="100%"
            value={JSON.stringify(formSchema, null, 2)}
            readOnly
            basicSetup={{
              foldGutter: false,
            }}
          />
        </div>
      </div>
      <div className="col-span-1 row-span-1 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">Value</h2>
          <div className="overflow-hidden border border-neutral-300 rounded bg-white grow">
            <CodeMirror
              theme={theme}
              extensions={ext}
              height="100%"
              value={JSON.stringify(value, null, 2)}
              readOnly
              basicSetup={{
                foldGutter: false,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">Errors</h2>
          <div className="overflow-hidden border border-neutral-300 rounded bg-white grow">
            <CodeMirror
              theme={theme}
              extensions={ext}
              height="100%"
              value={JSON.stringify(errors, null, 2)}
              readOnly
              basicSetup={{
                foldGutter: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
