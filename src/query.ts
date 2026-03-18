import { WhereOp, SortOp, GroupByOp, HavingOp } from './types';

type Phase = "where" | "groupBy" | "having" | "sort";

type IsValidSequence<
  T,
  Steps extends readonly any[],
  Current extends Phase = "where"
> = Steps extends []
  ? true
  : Steps extends [infer S, ...infer Rest]
  ? S extends WhereOp<T>
    ? Current extends "where"
      ? IsValidSequence<T, Rest, "where">
      : false
    : S extends GroupByOp<T, any>
    ? Current extends "where" | "groupBy"
      ? IsValidSequence<T, Rest, "groupBy">
      : false
    : S extends HavingOp<T, any>
    ? Current extends "where" | "groupBy" | "having"
      ? IsValidSequence<T, Rest, "having">
      : false
    : S extends SortOp<T>
    ? IsValidSequence<T, Rest, "sort">
    : false
  : false;

export type ValidQueryOps<T, Steps extends readonly any[]> =
  IsValidSequence<T, Steps> extends true
    ? Steps
    : ["Неверный порядок операторов в query"];

type LastReturn<T, Steps extends readonly any[]> = Steps extends [
  ...any[],
  infer Last
]
  ? Last extends { run: (arg: any) => infer R }
    ? R
    : T[]
  : T[];

export function query<T>() {
  return function <Steps extends readonly any[]>(
    ...steps: ValidQueryOps<T, Steps>
  ): (data: T[]) => LastReturn<T, Steps> {
    return (data: T[]) =>
      steps.reduce<any>((acc, step) => step.run(acc), data as any);
  };
}