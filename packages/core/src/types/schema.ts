declare module "@phalleux/jsf-schema-utils" {
  interface ObjectSchema {
    // Validation properties
    formatMinimum?: string | number;
    formatMaximum?: string | number;
    formatExclusiveMinimum?: string | number;
    formatExclusiveMaximum?: string | number;
    formatStep?: string | number;

    // Rendering properties
    "x-renderer"?: string | { type: string; options: unknown };
  }
}
