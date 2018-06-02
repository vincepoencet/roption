import * as mocha from 'mocha';
import { expect } from 'chai';
import { Option, Some, None } from '../src/Option';

describe('Option', () => {
  describe('Some', () => {
    it('should throw for null', () => {
      expect(() => Some(null)).to.throw();
    });

    it('should throw for undefined', () => {
      expect(() => Some(undefined)).to.throw();
    });
  })

  describe('isSome', () => {
    it('should equals true from Some', () => {
      const option = Some(42);
      expect(option.isSome()).to.equals(true);
    });

    it('should equals false from None', () => {
      const option = None();
      expect(option.isSome()).to.equals(false);
    });
  });

  describe('isNone', () => {
    it('should equals false for Some', () => {
      const option = Some(42);
      expect(option.isNone()).to.equals(false);
    });

    it('should equals true for None', () => {
      const option = None();
      expect(option.isNone()).to.equals(true);
    });
  });

  describe('map', () => {
    it('should apply function for Some', () => {
      const option = Some(42);
      expect(option.map(x => x + 1).unwrap()).to.equals(43);
    });

    it('should do nothing for None', () => {
      const option = None<number>();
      expect(() => option.map(x => {
        expect.fail('map should not be called for None');
      })).to.not.throw();
    });
  });

  describe('mapOr', () => {
    it('should apply provided function for Some', () => {
      const option = Some(42);
      expect(option.mapOr(100, x => x + 1)).to.equals(43);
    });

    it('should return default value for None', () => {
      const option = None<number>();
      expect(option.mapOr(100, x => x + 1)).to.equals(100);
    });
  });

  describe('mapOrElse', () => {
    it('should apply provided function for Some', () => {
      const option = Some(42);
      expect(option.mapOrElse(() => 100, x => x + 1)).to.equals(43);
    });

    it('should apply default function for None', () => {
      const option = None<number>();
      expect(option.mapOrElse(() => 100, x => x + 1)).to.equals(100);
    });
  });

  describe('and', () => {
    it('should equals None from Some.and(None)', () => {
      const x = Some(2);
      const y = None<string>();
      expect(x.and(y).isNone()).to.equals(true);
    });

    it('should equals None from None.and(Some)', () => {
      const x = None<number>();
      const y = Some('foo');
      expect(x.and(y).isNone()).to.equals(true);
    });

    it('should equals Some from Some.and(Some)', () => {
      const x = Some(2);
      const y = Some('foo');
      expect(x.and(y).unwrap()).to.equals('foo');
    });

    it('should equals None from None.and(None)', () => {
      const x = None<number>();
      const y = None<string>();
      expect(x.and(y).isNone()).to.equals(true);
    });
  });

  describe('andThen', () => {
    it('should match Rust examples', () => {
      const sq = (x: number) => Some(x * x);
      const nope = (_: number) => None();

      expect(Some(2).andThen(sq).andThen(sq).unwrap()).to.equals(16);
      expect(Some(2).andThen(sq).andThen(nope).isNone()).to.equals(true);
      expect(Some(2).andThen(nope).andThen(sq).isNone()).to.equals(true);
      expect(None().andThen(nope).andThen(sq).isNone()).to.equals(true);
    })
  });

  describe('or', () => {
    it('should equals Some for Some.or(None)', () => {
      const x = Some(2);
      const y = None<number>();

      expect(x.or(y).unwrap()).to.equals(2);
    });

    it('should equals Some for None.or(Some)', () => {
      const x = None<number>();
      const y = Some(42);

      expect(x.or(y).unwrap()).to.equals(42);
    });

    it('should equals Some for Some.or(Some)', () => {
      const x = Some(2);
      const y = Some(42);

      expect(x.or(y).unwrap()).to.equals(2);
    });

    it('should equals None for None.or(Some)', () => {
      const x = None();
      const y = None();

      expect(x.or(y).isNone()).to.equals(true);
    });
  });

  describe('orElse', () => {
    it('should match rust examples', () => {
      const nobody = () => None<string>();
      const vikings = () => Some('vikings');

      expect(Some('barbarians').orElse(vikings).unwrap()).to.equals('barbarians');
      expect(None<string>().orElse(vikings).unwrap()).to.equals('vikings');
      expect(None<string>().orElse(nobody).isNone()).to.equals(true);
    });
  });

  describe('unwrap', () => {
    it('should return value for Some', () => {
      const option = Some('Hello');
      expect(option.unwrap()).to.equals('Hello');
    });
    // it('should throw for None', () => {
    //   const option = None();
    //   expect(() => option.unwrap()).to.throw();
    // });
  });

  describe('unwrapOrDefault', () => {
    it('should match rust examples', () => {
      const goodYearFromInput = '1909';
      const badYearFromInput = 'a190blarg';
      const parse = (str: string): Option<number> => {
        const res = parseInt(str, 10);
        return isNaN(res) ? None() : Some(res);
      }

      const goodYear = parse(goodYearFromInput).unwrapOr(0);
      const badYear = parse(badYearFromInput).unwrapOr(0);

      expect(goodYear).to.equals(1909);
      expect(badYear).to.equals(0);
    });
  });

  describe('unwrapOrElse', () => {
    it('should match rust examples', () => {
      const k = 10;
      expect(Some(4).unwrapOrElse(() => 2 * k)).to.equals(4);
      expect(None().unwrapOrElse(() => 2 * k)).to.equals(20);
    });
  });

  describe('expect', () => {
    it('should match rust examples', () => {
      const x = Some('value');
      expect(x.expect('The world is ending')).to.equals('value');
      // expect(None<string>().expect('The world is ending')).to.equals(3);
    });
  });

  describe('okOr', () => {
    it('should convert Some<T> to Ok<T, E>', () => {
      const option = Some(42);
      const res = option.okOr('error');

      expect(res.unwrap()).to.equals(42);
    });

    it('should convert None<T> to Err<T, E>', () => {
      const option = None();
      const res = option.okOr('error');

      expect(res.unwrapErr()).to.equals('error');
    });
  });

  describe('okOrElse', () => {
    it('should convert Some<T> to Ok<T, E>', () => {
      const option = Some(42);
      const res = option.okOrElse(() => 'error');

      expect(res.unwrap()).to.equals(42);
    });

    it('should convert None<T> to Err<T, E>', () => {
      const option = None();
      const res = option.okOrElse(() => 'error');

      expect(res.unwrapErr()).to.equals('error');
    });
  });

  describe('match', () => {
    it('should call some function for Some', () => {
      const option = Some(42);
      const str = option.match(
        x => x.toString(),
        () => 'None',
      );

      expect(str).to.equals('42');
    });

    it('should call none function for None', () => {
      const option = None<number>();
      const str = option.match(
        x => x.toString(),
        () => 'None',
      );

      expect(str).to.equals('None');
    });
  })
});