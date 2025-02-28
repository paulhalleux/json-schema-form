import { memo } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeLightInit } from "@uiw/codemirror-theme-vscode/src/light.ts";
import ReactCodeMirror from "@uiw/react-codemirror";

const ext = [javascript()];
const theme = vscodeLightInit({
  theme: "light",
  settings: {
    fontSize: "14px",
  },
});

export const Code = memo(function Code({
  value,
  editable,
  onChange,
}: {
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <ReactCodeMirror
      theme={theme}
      extensions={ext}
      height="100%"
      value={value}
      onChange={onChange}
      readOnly={!editable}
      basicSetup={{
        foldGutter: false,
      }}
    />
  );
});
