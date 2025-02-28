import { dateFormatRenderer } from "./date.ts";
import { dateTimeFormatRenderer } from "./date-time.ts";
import { emailFormatRenderer } from "./email.ts";
import { passwordFormatRenderer } from "./password.ts";
import { timeFormatRenderer } from "./time.ts";

export const formats = [
  emailFormatRenderer,
  dateFormatRenderer,
  dateTimeFormatRenderer,
  timeFormatRenderer,
  passwordFormatRenderer,
];
