import { cardedObjectRenderer } from "./object/carded.tsx";
import { defaultArrayRenderer } from "./array";
import { defaultNumberRenderer } from "./number";
import { defaultObjectRenderer } from "./object";
import { stringRenderers } from "./string";

export const reactVanillaRenderers = [
  ...stringRenderers,
  cardedObjectRenderer,
  defaultObjectRenderer,
  defaultNumberRenderer,
  defaultArrayRenderer,
];
