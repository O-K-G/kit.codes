/**
 * AVIF images imported with "?url" (see next.config.ts: Turbopack emits them as they are): the file's
 * URL, content-hashed, so it's cached immutably.
 */
declare module "*.avif?url" {
  const url: string;
  export default url;
}
