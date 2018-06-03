# roption
[![Build Status](https://travis-ci.org/vincepoencet/roption.svg?branch=master)](https://travis-ci.org/vincepoencet/roption)

Typescript Rust-like Option and Result types, with some small adjustments

## Install

```console
$ npm install --save roption
```

## Usage

```js
import { Option, Some, None } from 'roption';

function divide(numerator: number, denominator: number): Option<number> {
  if (denominator === 0) {
    return None();
  }

  return Some(numerator / denominator);
}

const result = divide(2, 3);

result.match(
  result => console.log('Result', result),
  () => console.log('Cannot divide by 0'),
);
```

See [Rust Option](https://doc.rust-lang.org/std/option/enum.Option.html)
and [Rust Result](https://doc.rust-lang.org/std/result/enum.Result.html)
documentation.

All functions have been converted in camelCase