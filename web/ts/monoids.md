One example of a use of a monoid. Suppose that you have a bunch of validation
functions:

``` typescript
function isOdd (number): boolean { ... }
function isFourDigitsLong (number): boolean { ... }
function isPrime (number): boolean { ... }
```

I could write code like this to compose a new validation function:

``` typescript
function validatePassword (n: number): boolean {
	return isOdd && isFourDigitsLong && isPrime
}
```

There's actually nothing wrong with this code. But maybe I need to construct a
lot of new validation functions from existing validation functions. And maybe
I don't know exactly which set of existing validation functions I will use at
runtime. I could probably write a generic validation function composer.

``` typescript
function selectValidations (...): Array<number => boolean> {
	// validation functions are selected at runtime
}

function composeValidations (fns: Array<number => boolean>): (number => boolean) {
	return function (n: number): (number => boolean) {
		const isValid = true
		for (let i = 0; i < fns.length; i++) {
			if (!fns[i](n)) {
				isValid = false
			}
			// Alternatively,
			// isValid = isValid && fns[i](n)
		}
		return isValid
	}
}
```

Oh oh oh! This reminds me of a pattern of something I do a lot: I have a
collection of items and I want to aggregate them into a single value. I think
it's called folding (or reducing).

Let's see. To fold a structure into a single value, I need three things: the
structure, an initial starting value, and a *closed* binary function that
accumulates the different values of the structure.

In `composeValidations`, we have our structure (`fns`), an initial starting
value (`true`), and a binary function that "reduces" the structure (boolean
`&&` operator).

``` typescript
function composeValidations (fns: Array<number => boolean>): (number => boolean) {
	return function (n: number): (number => boolean) {
		return fns
			.map(fn => fn(n)) // apply all of the validation functions => Array<boolean>
			.reduce(&&, true) // reduce Array<boolean> => boolean
	}
}
```

Wow. That's a lot easier to reason about. Folding is cool!

But wait, I've noticed something. The `&&` operation under Boolean values has a
few properties that seem familiar.

1. It's associative. `(a && b) && c == a && (b && c)`
2. It's closed. `<bool> && <bool> => <bool>`
3. It has an additive identity: `true`.

`a && true == true` (right identity)
`true && a == true` (left identity)

Also, the additive identity acts a lot like zero. `&&` over zero elements is
vacuously `true`. https://www.wikiwand.com/en/Vacuous_truth

Wait! This is a *monoid*! There exists a function, `foldMap`, that, given a
function that maps from any type, `T`, to a monoidal type, and a mappable
structure of type `T`, I can *fold* the structure of `T`. Woah! That's exactly
what I'm doing in `composeValidations`.

`apply: fn => fn(n)` is the function that I'm using in `map(fn => fn(n))` to
apply each validation function to the argument to get booleans. And there's
only one way to combine a monoid. Start with the identity element `isValid =
true`, and keep applying `&&` to the accumulated result until there's no more
elements to apply. E.g.

```
accumulator | remaining
true          [true, true, false]
true          [true, false]
true          [false]
false         []
```

If such a `foldMap` function existed in our language, we could simply write:

``` typescript
function composeValidations (fns: Array<number => boolean>): (number => boolean) {
	return function (n: number): (number => boolean) {
		return foldMap((fn => fn(n) as Conjunction, fns)
	}
}

validatePassword = composeValidations([isOdd, isFourDigitsLong, isPrime])
```

Here's an example of what `composeValidations` looks like in PureScript:
https://github.com/nutty7t/advent-of-code/blob/master/2019/04/src/Main.purs#L48-L50

Notice that `validatePassword` works even when an empty list is passed to it.

```
validatePassword = composeValidations([])
validatePassword(12351) // => true
```

This only works because monoids have an identity element. Empty conjunctions
are vacuously true.

This all seems abstract, but it provides us programmers with a really nice, terse
vocabulary for describing many common patterns.

```
// Sum of squares.
foldMap((n => n * n as Additive), [1, 2, 3]) // => 15
```

This works really well with abstract data types.

Suppose that I have a sum type that extends an existing type with the value of `Nothing`.

```
type Maybe<T> = Just T | Nothing

// Just "hello" is of type Maybe<string>
// Nothing is of type Maybe<string>
// Just "" is of type Maybe<string>
```

Say that I have a function that converts tries to parse a list of strings into
a list of integers, and then sum them together. But I don't care about the
result if the parsing fails for one of the elements. I could define a monoidal
operation, `+` for `Maybe<T>` that behaves like the following:

```
// a and b are of type T
Just a + Nothing = Nothing
Nothing + Just a = Nothing
Just a + Just b = Just (a + b)
```

Then I could simply write the above like this:

``` typescript
function parseNumber (s: string): Maybe<number> {
	// returns Just<number> if parsing succeeds
	// returns Nothing if parsing fails
}

result1 = foldMap(parseNumber, ['1', '2', '3', '44'])  // => Just 50
result2 = foldMap(parseNumber, ['1', '2', '3', 'foo']) // => Nothing
```

The generalization of a fold is called a catamorphism. Since we're folding over
a collection of Maybe types, this operation above is what you might call a
Maybe catamorphism. If you're not working with abstract data types all that
often, folding (or reducing) and catamorphisms are basically the same thing.

Basically, monoids are great for composing functionality together. And they provide
great guarantees for reasoning about your code.
