export type DeepRecord<K extends keyof any, T> = {
  [P in K]: Record<K, DeepRecord<K, T> | T> | T;
};
