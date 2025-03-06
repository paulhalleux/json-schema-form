declare module "@phalleux/jsf-schema-utils" {
  interface ObjectSchema {
    formatMinimum?: string | number;
    formatMaximum?: string | number;
    formatExclusiveMinimum?: string | number;
    formatExclusiveMaximum?: string | number;
    formatStep?: string | number;
  }
}
