export type OptionalKeysOf<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;

export type OptionalPropertiesOf<T extends object> = {
  [K in OptionalKeysOf<T>]: T[K];
};

export type NonNullableRecord<T extends object> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type StringKeysOf<T extends object> = Exclude<
  {
    [K in keyof T]: T[K] extends string ? K : never;
  }[keyof T],
  undefined
> &
  keyof T;

export type StringPropertiesOf<T extends object> = {
  [K in StringKeysOf<T>]: T[K];
} & T & { [K: string]: string };

export const shells = [
  "/bin/sh",
  "/bin/bash",
  "/bin/rbash",
  "/bin/dash",
  "/bin/tcsh",
  "/bin/csh",
  "/bin/zsh",
  "/usr/bin/zsh",
  "/usr/bin/fish",
] as const;

export type Shell = (typeof shells)[number];
