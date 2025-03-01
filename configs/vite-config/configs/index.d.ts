export {};

declare module "@buddy-builder/vite-config/lib" {
  import { UserConfig } from "vite";
  const config: UserConfig;
  export default config;
}

declare module "@buddy-builder/vite-config/app" {
  import { UserConfig } from "vite";
  const config: UserConfig;
  export default config;
}
