import { numberRenderers } from "./number";
import { stringRenderers } from "./string";

export const reactVanillaRenderers = [...stringRenderers, ...numberRenderers];
