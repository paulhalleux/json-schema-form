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

export function Code({ value }: { value: string }) {
  return (
    <ReactCodeMirror
      theme={theme}
      extensions={ext}
      height="100%"
      value={value}
      readOnly
      basicSetup={{
        foldGutter: false,
      }}
    />
  );
}
