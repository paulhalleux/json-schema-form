import { createFormatRenderer } from "../format-helpers.tsx";

export const passwordFormatRenderer = createFormatRenderer({
  format: "password",
  getProps: () => ({
    type: "password",
  }),
});
