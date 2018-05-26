import { Some, None, Option } from "./Option";

export class _Ok<T, E> {
  constructor(
    private readonly value: T,
  ) {}

  isOk() {
    return true;
  }

  isErr() {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  /* istanbul ignore next */
  unwrapErr(): E {
    console.error('PANIC: unwrapErr called on Ok');
    process.exit(1);
    throw new Error('PANIC: unwrapErr called on Ok');
  }

  ok(): Option<T> {
    return Some(this.value);
  }

  err(): Option<E> {
    return None();
  }

  map<R>(f: (wrapped: T) => R): Result<R, E> {
    return Ok<R, E>(f(this.value))
  }

  mapErr<R>(f: (wrapped: E) => R): Result<T, R> {
    return Ok<T, R>(this.value);
  }

  and<R>(res: Result<R, E>): Result<R, E> {
    return res;
  }

  andThen<U>(f: (wrapped: T) => Result<U, E>): Result<U, E> {
    return f(this.value);
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    return Ok(this.value);
  }

  orElse<F, O>(op: (error: E) => Result<T, F>): Result<T, F> {
    return Ok(this.value);
  }

  unwrapOr(defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(fDefault: (e: E) => T): T {
    return this.value;
  }

  expect(msg: string): T {
    return this.value;
  }

  /* istanbul ignore next */
  expectErr(msg: string): E {
    console.error(`PANIC: ${msg}`);
    process.exit(1);
    throw new Error(`PANIC: ${msg}`);
  }
}

export class _Err<T, E> {
  constructor(
    private readonly error: E,
  ) {}

  isOk() {
    return false;
  }

  isErr() {
    return true;
  }

  ok(): Option<T> {
    return None<T>();
  }

  err(): Option<E> {
    return Some(this.error);
  }

  /* istanbul ignore next */
  unwrap(): T {
    console.error('PANIC: unwrap called on Err');
    process.exit(1);

    // only for compiler
    throw new Error('PANIC: unwrap called on Err');
  }

  unwrapErr(): E {
    return this.error;
  }

  map<R>(f: (wrapped: T) => R): Result<R, E> {
    return Err<R, E>(this.error);
  }

  mapErr<R>(f: (wrapped: E) => R): Result<T, R> {
    return Err<T, R>(f(this.error));
  }

  and<R>(res: Result<R, E>): Result<R, E> {
    return Err(this.error);
  }

  andThen<U>(f: (wrapped: T) => Result<U, E>): Result<U, E> {
    return Err(this.error);
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    return res;
  }

  orElse<F, O>(op: (error: E) => Result<T, F>): Result<T, F> {
    return op(this.error);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fDefault: (e: E) => T): T {
    return fDefault(this.error);
  }

  /* istanbul ignore next */
  expect(msg: string): T {
    console.error(`PANIC: ${msg}`);
    process.exit(1);
    throw new Error(`PANIC: ${msg}`);
  }

  expectErr(msg: string): E {
    return this.error;
  }
}

export function Ok<T, E>(value: T): Result<T, E> {
  return new _Ok(value);
}

export function Err<T, E>(error: E): Result<T, E> {
  return new _Err(error);
}

export type Result<T, E> = _Ok<T, E> | _Err<T, E>