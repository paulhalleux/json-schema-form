import type { SchemaRenderer } from "@phalleux/jsf-core";
import { Tester } from "@phalleux/jsf-schema-utils";

import { RenderSchema, useStore } from "../adapter";

export const debugRenderer: SchemaRenderer = {
  id: "react.builtin.debug",
  tester: Tester((builder) => {
    builder.add(() => {
      return true;
    });
  }),
  priority: 100,
  renderer: function PlaygroundDebugRenderer(props) {
    const debug = useStore((_, form) => form.getFlag("debug"));

    if (!debug) {
      return <RenderSchema {...props} />;
    }

    return (
      <div className="w-full border rounded-sm overflow-hidden">
        <div className="text-xs h-6 bg-black text-white px-1 flex items-center gap-1">
          <span title={JSON.stringify(props.schema.toJSON(), null, 2)}>
            Schema:
          </span>
          <span className="opacity-50">{props.schema.getPath()}</span>
          <span> | </span>
          <span>Path:</span>
          <span className="opacity-50">
            {props.path === "" ? "#root" : props.path}
          </span>
        </div>
        <div className="p-1 w-full">
          <RenderSchema {...props} />
        </div>
      </div>
    );
  },
};
