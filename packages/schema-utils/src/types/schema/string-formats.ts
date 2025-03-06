export const formatNames = [
  "date-time",
  "date",
  "time",
  "duration",
  "email",
  "hostname",
  "idn-email",
  "idn-hostname",
  "ipv4",
  "ipv6",
  "iri",
  "iri-reference",
  "json-pointer",
  "regex",
  "relative-json-pointer",
  "uri",
  "uri-reference",
  "uri-template",
  "uuid",
] as const;

/**
 * List of string formats that can be used in a JSON Schema.
 * @see {@link https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01#section-7 | Format}
 */
export type Format = (typeof formatNames)[number];
