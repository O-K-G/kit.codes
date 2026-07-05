export const parseLabel = (val: string) =>
  val?.replaceAll(/[^a-zA-Z]/g, "")?.toLocaleLowerCase();
