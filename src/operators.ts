import { 
  WhereOp, SortOp, GroupByOp, HavingOp, Group 
} from './types';

export function where<T, K extends keyof T>(key: K, value: T[K]): WhereOp<T> {
  return {
    _tag: "where",
    run: (data: T[]) => data.filter((item) => item[key] === value),
  };
}

export function sort<T, K extends keyof T>(key: K): SortOp<T> {
  return {
    _tag: "sort",
    run: (data: T[]) =>
      [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
      }),
  };
}

export function groupBy<T, K extends keyof T>(key: K): GroupByOp<T, K> {
  return {
    _tag: "groupBy",
    run: (data: T[]) =>
      Object.values(
        data.reduce(
          (acc, item) => {
            const groupKey = String(item[key]);
            if (!acc[groupKey]) {
              acc[groupKey] = { key: item[key], items: [] };
            }
            acc[groupKey]!.items.push(item);
            return acc;
          },
          {} as Record<string, Group<T, K>>
        )
      ) as Group<T, K>[],
  };
}

export function having<T, K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
): HavingOp<T, K> {
  return {
    _tag: "having",
    run: (groups: Group<T, K>[]) => groups.filter(predicate),
  };
}