// Intersection types can be used as mixins.
function extend<First, Second>(first: First, second: Second): First & Second {
	const result: Partial<First & Second> = {}
	for (const prop in first) {
		if (first.hasOwnProperty(prop)) {
			// Why is it that we need a type assertion here?
			//
			// I'm thinking that it might be related to property access.  I
			// don't know. Or maybe it's because First is not assignable to
			// First & Second. A type T is assignable to an intersection type I
			// if T is assignable to each type in I. First is only assignable
			// to Second if the type of Second is {}.
			(result as First)[prop] = first[prop]
		}
	}
	for (const prop in second) {
		if (second.hasOwnProperty(prop)) {
			(result as Second)[prop] = second[prop]
		}
	}
	return result as First & Second
}

interface Foo {
	foo: string
}

interface Bar {
	bar: number
}

const boop: Partial<Foo & Bar> = {}
const foo: Foo = { foo: 'oof' }
boop.foo = foo.foo

for (const prop in foo) {
	if (foo.hasOwnProperty(prop)) {
		// This doesn't need a type assertion. Why?
		//
		// Is it because Foo is not generic?
		//
		// In extend, prop is inferred as Extract<keyof First, string>.
		// Here, prop is inferred to be string.
		boop[prop] = foo[prop]
	}
}

function narrow (boop: Foo | Bar) {
	// The `in` operator acts as a narrowing expression for types.
	if ('foo' in boop) {
		// In this block, TS can deduce that boop is Foo.
		// => (parameter) boop: Foo
		boop
	}
}

// TypeScript recognizes typeof as a type guard.
function typeofTest (arg: string | number): void {
	if (typeof arg === 'number') {
		arg // => (parameter) arg: number
	}
	if (typeof arg === 'string') {
		arg // => (parameter) arg: string
	}
}

// TypeScript lets users write their own type guards.
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6

// `n is DiceRoll` is called a type predicate.
function isDiceNumber (n: number): n is DiceRoll {
	return n in [1, 2, 3, 4, 5, 6]
}

const someNumber: number = 7

if (isDiceNumber(someNumber)) {
	someNumber // => const someNumber: DiceRoll
} else {
	someNumber // => const someNumber: number
}

// How does inferencing work for multiple type guards?
type PrimeRoll = 2 | 3 | 5 | 7

function isPrime (n: number): n is PrimeRoll {
	return n in [2, 3, 5, 7]
}

if (isPrime(someNumber) || isDiceNumber(someNumber)) {
	someNumber // => const someNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7

	// TS takes the union of the two types.
	// This is pretty awesome.
}

if (isPrime(someNumber) && isDiceNumber(someNumber)) {
	someNumber // => const someNumber: 2 | 3 | 5

	// TS takes the intersection of the two types.
	// Yeah, this is awesome. Type narrowing is crazy!
	// Boolean operations become set operations on the domains of the types.
}

// The instanceof operator also performs type narrowing based on the prototype
// constructor.
class Car {
	make: string
	model: string
	year: string

	constructor (make: string, model: string, year: string) {
		this.make = make
		this.model = model
		this.year = year
	}
}

function instanceofTest (car: any) {
	if (car instanceof Car) {
		car // => (parameter) car: Car
	}
	if (car instanceof Object) {
		car // => (parameter) car: any
	}
}
