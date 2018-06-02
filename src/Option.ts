import { Err, Result, Ok } from "./Result";

export class _Some<T> {
  constructor(
    private readonly value: T,
  ) {}

  isSome() {
    return true;
  }

  isNone() {
    return false;
  }

  map<R>(f: (wrapped: T) => R): Option<R> {
    return Some(f(this.value));
  }

  mapOr<R>(defaultValue: R, f: (wrapped: T) => R): R {
    return f(this.value);
  }

  mapOrElse<R>(fDefault: () => R, f: (wrapped: T) => R): R {
    return f(this.value);
  }

  and<R>(optb: Option<R>): Option<R> {
    if (optb.isNone()) {
      return None();
    }

    return optb;
  }

  or(optb: Option<T>): Option<T> {
    return this;
  }

  orElse(f: () => Option<T>): Option<T> {
    return this;
  }

  andThen<R>(f: (wrapped: T) => Option<R>): Option<R> {
    return f(this.value);
  }

  okOr<E>(error: E): Result<T, E> {
    return Ok(this.value);
  }

  okOrElse<E>(fError: () => E): Result<T, E> {
    return Ok(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(fDefault: () => T): T {
    return this.value;
  }

  expect(msg: string): T {
    return this.value;
  }

  match<R>(fSome: (wrapped: T) => R, fNone: () => R) {
    return fSome(this.value);
  }
}

export class _None<T> {
  constructor(
  ) {}

  isSome() {
    return false;
  }

  isNone() {
    return true;
  }

  map<R>(f: (wrapped: T) => R): Option<R> {
    return None();
  }

  mapOr<R>(defaultValue: R, f: (wrapped: T) => R): R {
    return defaultValue;
  }

  mapOrElse<R>(fDefault: () => R, f: (wrapped: T) => R): R {
    return fDefault();
  }

  and<R>(optb: Option<R>): Option<R> {
    return None();
  }

  andThen<R>(f: (wrapped: T) => Option<R>): Option<R> {
    return None();
  }

  or(optb: Option<T>): Option<T> {
    return optb.mapOr(None(), x => Some(x));
  }

  orElse(f: () => Option<T>): Option<T> {
    return f();
  }

  okOr<E>(error: E): Result<T, E> {
    return Err(error);
  }

  okOrElse<E>(fError: () => E): Result<T, E> {
    return Err(fError());
  }

  /* istanbul ignore next */
  unwrap(): T {
    console.error('PANIC: unwrap called on None');
    process.exit(1);

    // only for compiler
    throw new Error('Unwrap called on None');
  }
  
  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fDefault: () => T): T {
    return fDefault();
  }
  
  /* istanbul ignore next */
  expect(msg: string): T {
    console.error(`PANIC: ${msg}`);
    process.exit(1);

    // only for compiler
    throw new Error(`PANIC: ${msg}`);
  }

  match<R>(fSome: (wrapped: T) => R, fNone: () => R) {
    return fNone();
  }
}

export function Some<T>(value: T): Option<T> {
  if (value === null || value === undefined) {
    throw Error('Cannot create Some from null or undefined');
  }

  return new _Some(value);
}

export function None<T>(): Option<T> {
  return new _None();
}

export type Option<T> = _Some<T> | _None<T>;

