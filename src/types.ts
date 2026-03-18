export type Transform<T> = (data: T[]) => T[];

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type WhereOp<T> = {
  _tag: "where";
  run: Transform<T>;
};

export type SortOp<T> = {
  _tag: "sort";
  run: Transform<T>;
};

export type GroupByOp<T, K extends keyof T = keyof T> = {
  _tag: "groupBy";
  run: (data: T[]) => Group<T, K>[];
};

export type HavingOp<T, K extends keyof T = keyof T> = {
  _tag: "having";
  run: (groups: Group<T, K>[]) => Group<T, K>[];
};