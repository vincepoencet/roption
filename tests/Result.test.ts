import * as mocha from 'mocha';
import { expect } from 'chai';
import { Result, Ok, Err } from '../src/Result';

describe('Result', () => {
  describe('isOk', () => {
    it('should equals true for Ok', () => {
      const result = Ok(42);
      expect(result.isOk()).to.equals(true);
    });

    it('should equals false for Err', () => {
      const result = Err(42);
      expect(result.isOk()).to.equals(false);
    });
  });

  describe('isErr', () => {
    it('should equals false for Ok', () => {
      const result = Ok(42);
      expect(result.isErr()).to.equals(false);
    });

    it('should equals true for Err', () => {
      const result = Err(42);
      expect(result.isErr()).to.equals(true);
    });
  });

  describe('ok', () => {
    it('should convert Ok<T, E> to Some<T>', () => {
      const res = Ok(42);
      const option = res.ok();
      expect(option.unwrap()).to.equals(42);
    });

    it('should convert Err<T, E> to None<T>', () => {
      const res = Err('error');
      const option = res.ok();
      expect(option.isNone()).to.equals(true);
    });
  });

  describe('err', () => {
    it('should convert Ok<T, E> to None<E>', () => {
      const res = Ok(42);
      const option = res.err();
      expect(option.isNone()).to.equals(true);
    });

    it('should convert Err<T, E> to Some<E>', () => {
      const res = Err('error');
      const option = res.err();
      expect(option.unwrap()).to.equals('error');
    });
  });

  describe('unwrapErr', () => {
    const res = Err('error');
    expect(res.unwrapErr()).to.equals('error');
  });

  describe('map', () => {
    it('should map Ok<T, E> to Ok<R, E>', () => {
      const result = Ok(3);
      const err: Result<number, string> = Err('Error');
      expect(result.map(x => x * 2).unwrap()).to.equals(6);
      expect(err.map(x => x * 2).isErr()).to.equals(true);
    });
  });

  describe('mapOrElse', () => {
    it('should apply provided function for Ok', () => {
      const k = 21;
      const result: Result<string, string> = Ok('foo');
      expect(result.mapOrElse(err => k * 2, val => val.length)).to.equals(3);
    });

    it('should apply error function for Err', () => {
      const k = 21;
      const result: Result<string, string> = Err('Error');
      expect(result.mapOrElse(err => k * 2, val => val.length)).to.equals(42);
    });
  });

  describe('mapErr', () => {
    it('should map Err<T, E> to Err<T, R>', () => {
      const result: Result<number, string> = Ok(3);
      const err: Result<number, string> = Err('Error');
      expect(result.mapErr(e => e.toLowerCase()).unwrap()).to.equals(3);
      expect(err.mapErr(e => e.toLowerCase()).unwrapErr()).to.equals('error');
    });
  });

  describe('and', () => {
    it('should match rust examples', () => {
      let x: Result<number, string> = Ok(2);
      let y: Result<number, string> = Err('late error');
      expect(x.and(y).unwrapErr()).to.equals('late error');

      x = Err('early error');
      y = Ok(42);
      expect(x.and(y).unwrapErr()).to.equals('early error');
    
      x = Err('not a 2');
      y = Err('late error');
      expect(x.and(y).unwrapErr()).to.equals('not a 2');

      x = Ok(2);
      y = Ok(42);
      expect(x.and(y).unwrap()).to.equals(42);

      x = Ok(2);
      const z: Result<string, string> = Ok('different type');
      expect(x.and(z).unwrap()).to.equals('different type');
    });
  });

  describe('andThen', () => {
    it('should match rust examples', () => {
      const sq: (x: number) => Result<number, number> = (x) => Ok(x * x);
      const err: (x: number) => Result<number, number> = (x) => Err(x);

      expect(Ok(2).andThen(sq).andThen(sq).unwrap()).to.equals(16);
      expect(Ok(2).andThen(sq).andThen(err).unwrapErr()).to.equals(4);
      expect(Ok(2).andThen(err).andThen(sq).unwrapErr()).to.equals(2);
      expect(Err(3).andThen(sq).andThen(sq).unwrapErr()).to.equals(3);
    });
  });

  describe('or', () => {
    it('should match rust examples', () => {
      let x: Result<number, string> = Ok(2);
      let y: Result<number, string> = Err('late error');
      expect(x.or(y).unwrap()).to.equals(2);

      x = Err('early error');
      y = Ok(2);
      expect(x.or(y).unwrap()).to.equals(2);

      x = Err('not a 2');
      y = Err('late error');
      expect(x.or(y).unwrapErr()).to.equals('late error');

      x = Ok(2);
      y = Ok(100);
      expect(x.or(y).unwrap()).to.equals(2);
    });
  });

  describe('orElse', () => {
    it('should match rust examples', () => {
      const sq: (x: number) => Result<number, number> = (x) => Ok(x * x);
      const err: (x: number) => Result<number, number> = (x) => Err(x);

      expect(Ok(2).orElse(sq).orElse(sq).unwrap()).to.equals(2);
      expect(Ok(2).orElse(err).orElse(sq).unwrap()).to.equals(2);
      expect(Err(3).orElse(sq).orElse(err).unwrap()).to.equals(9);
      expect(Err(3).orElse(err).orElse(err).unwrapErr()).to.equals(3);
    });
  });

  describe('unwrapOr', () => {
    it('should match rust examples', () => {
      const optb = 2;
      let x: Result<number, string> = Ok(9);
      expect(x.unwrapOr(optb)).to.equals(9);

      x = Err('error');
      expect(x.unwrapOr(optb)).to.equals(optb);
    });
  });

  describe('unwrapOrElse', () => {
    it('should match rust examples', () => {
      const count: (x: string) => number = x => x.length;
      const ok = Ok(2);
      const err = Err('foo');

      expect(ok.unwrapOrElse(count)).to.equals(2);
      expect(err.unwrapOrElse(count)).to.equals(3);
    });
  });

  describe('expect', () => {
    it('should unwrap for Ok', () => {
      expect(Ok(2).expect('Boom !!!')).to.equals(2);
    });
  });

  describe('expectErr', () => {
    it('should unwrap for Err', () => {
      expect(Err(2).expectErr('Boom !!!')).to.equals(2);
    });
  });

  describe('match', () => {
    it('should call ok function for Ok', () => {
      const result = Ok(42);
      const str = result.match(
        x => x.toString(),
        err => 'Error',
      );

      expect(str).to.equals('42');
    });

    it('should call none function for None', () => {
      const option = Err<number, string>('Boom!');
      const str = option.match(
        x => x.toString(),
        err => err,
      );

      expect(str).to.equals('Boom!');
    });
  });
});