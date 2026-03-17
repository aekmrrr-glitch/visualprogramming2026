import { Transform, Where, Sort, GroupBy, Having, Group } from './types/transforms';

type AnyTransform = (data: any) => any;

export function query<T>(
  ...steps: AnyTransform[]
): Transform<T> {
  return (data: T[]): T[] => {
    let currentData: any = data;
    
    for (const step of steps) {
      currentData = step(currentData);
    }
    
    return currentData as T[];
  };
}

export function createWhere<T>(): Where<T> {
  return (key, value) => (data) => 
    data.filter(item => item[key] === value);
}

export function createSort<T>(): Sort<T> {
  return (key) => (data) => 
    [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
}

export function createGroupBy<T>(): GroupBy<T> {
  return <K extends keyof T>(key: K) => (data: T[]): Group<T, K>[] => {
    const groupsMap = new Map<T[K], Group<T, K>>();
    
    for (const item of data) {
      const groupKey = item[key];
      const existing = groupsMap.get(groupKey);
      
      if (existing) {
        existing.items.push(item);
      } else {
        groupsMap.set(groupKey, { key: groupKey, items: [item] });
      }
    }
    
    return Array.from(groupsMap.values());
  };
}

export function createHaving<T>(): Having<T> {
  return (predicate) => (groups) => 
    groups.filter(predicate);
}