import type { ErrorObject } from "ajv";

/**
 * Get the path of the value that caused the error
 * @param error - The error object
 */
export function errorToJsonPath(error: ErrorObject): string {
  if (error.keyword === "required") {
    return `${error.instancePath}/${error.params.missingProperty}`;
  }
  return error.instancePath;
}
