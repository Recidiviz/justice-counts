export const slugify = (str: string): string =>
  str?.replace(/\s/g, "-")?.toLowerCase();
