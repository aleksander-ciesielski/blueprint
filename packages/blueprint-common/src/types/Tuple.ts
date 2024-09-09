// eslint-disable-next-line @typescript-eslint/naming-convention
type _Tuple<N extends number, T, TAcc extends T[]> = (
  TAcc["length"] extends N
    ? TAcc
    : _Tuple<N, T, [...TAcc, T]>
);

export type Tuple<N extends number, T> = _Tuple<N, T, []>;
