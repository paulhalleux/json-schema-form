export function pathToSchemaPath(path: string): string {
  return path.replace(".", "/properties/");
}
