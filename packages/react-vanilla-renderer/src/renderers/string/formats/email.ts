import { createFormatRenderer } from "../format-helpers.tsx";

export const emailFormatRenderer = createFormatRenderer({
  format: "email",
  getProps: () => ({
    type: "email",
  }),
});
