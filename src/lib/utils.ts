export const removeUndefinedProperty = <
  T extends Record<string, string | number | undefined>
>(
  data: T
): { [K in keyof T]: T[K] extends undefined ? never : T[K] } => {
  const out: ReturnType<typeof removeUndefinedProperty> = {};

  for (const key in data) {
    const value = data[key];
    if (typeof value !== "undefined") {
      out[key] = value;
    }
  }

  return out as any;
};
