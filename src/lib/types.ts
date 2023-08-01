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
