import { numberRenderers } from "./number";
import { objectRenderers } from "./object";
import { stringRenderers } from "./string";

export const reactVanillaRenderers = [
  ...stringRenderers,
  ...numberRenderers,
  ...objectRenderers,
];
