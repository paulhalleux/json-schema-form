import { DateStringFormat } from "./date.ts";
import { DateTimeStringFormat } from "./date-time.ts";
import { DurationStringFormat } from "./duration.ts";
import { EmailStringFormat } from "./email.ts";
import { StringFieldFormat } from "./helpers.ts";
import { TimeStringFormat } from "./time.ts";

/**
 * Define the formats for the string field.
 * Schema will be matched against each format in order to determine the props to pass to the field.
 */
export const formats: StringFieldFormat<any>[] = [
  EmailStringFormat,
  DateStringFormat,
  TimeStringFormat,
  DateTimeStringFormat,
  DurationStringFormat,
];

export { getStringFieldFormat, createFormat } from "./helpers.ts";
