// Iterator Protocol
//
// An *iterator* is an object that implements a next method:
// next :: ...arguments -> { value: any, done?: boolean }

function makeNaturalIterator () {
	let number = -1
	return {
		next () {
			number++
			return {
				value: number,
				done: number > 100,
			}
		}
	}
}

// Output 1 .. 100
{
	const iterator = makeNaturalIterator()
	let result = iterator.next()
	while (!result.done) {
		console.log('iterator #1 ' +  result.value)
		result = iterator.next()
	}
}

// Generator Functions
//
// Used to define iterative algorithms by writing a single function whose
// execution is not continuous.

function* makeNaturalIterator2 () {
	for (let i = 0; i <= 100; i++) {
		yield i
	}
}

// Output 1 .. 100
{
	const iterator = makeNaturalIterator2()
	let result = iterator.next()
	while (!result.done) {
		console.log('iterator #2 ' + result.value)
		result = iterator.next()
	}
}

// Another example -- infinite lists ([1, 2, 3, 1, 2, 3, ...].
const sortByOptions = [
  'NONE',
  'ASCENDING',
  'DESCENDING'
]

function* sortByIterator () {
  let index = 0
  while (true) {
    yield sortByOptions[index % sortByOptions.length]
    index++
  }
}

const iter = sortByIterator()
console.log(iter.next().value) // => 'NONE'
console.log(iter.next().value) // => 'ASCENDING'
console.log(iter.next().value) // => 'DESCENDING'
console.log(iter.next().value) // => 'NONE'
console.log(iter.next().value) // => 'ASCENDING'
console.log(iter.next().value) // => 'DESCENDING'

// Iterable
//
// There is a distinction between Iterator and Iterable.
//
// An object is *iterable* if it implements the `@@iterator` method.
// `@@iterator` is an abstract concept that is isomorphic to `Symbol.iterator`.
// The purpose of the `@@iterator` method is to return an object that conforms
// to the "Iterator Protocol".

function* simpleIterator () {
	yield 1
	yield 2
	yield 3
}

{
	const numbers = simpleIterator()
	for (const n of numbers) {
		console.log(n)
	}

	// noop, already done
	for (const n of numbers) {
		console.log(n)
	}

	// Generator functions return `this` from their `@@iterator` method.
	// `numbers` is an iterable that can iterate only once.
	console.log(numbers[Symbol.iterator]() === numbers) // => true

	// If you change the `@@iterator` method to a function/generator which
	// returns a new iterator/generator object, then the iterable can iterate
	// many times.
	numbers[Symbol.iterator] = function* () {
		yield 1
		yield 2
	}

	for (const n of numbers) {
		console.log(n)
	}

	// Now, we can iterate multiple times using the same iterable.
	for (const n of numbers) {
		console.log(n)
	}
}

// Let's try making an iterable from makeNaturalIterator.
const naturalIterable = {
	[Symbol.iterator]: makeNaturalIterator
}

for (const n of naturalIterable) {
	console.log('natural iterable #1 ' + n)
}

// naturalIterable can iterate multiple times because @@iterator produces an
// object that conforms to the Iterator Protocol.
for (const n of naturalIterable) {
	console.log('natural iterable #2 ' + n)
}

// This is both an Iterator AND an Iterable.
const naturalIterable2 = {
	// edit: actually, I'm dumb. It's not an iterator. It's actually this.next
	// that's an iterator. See below for a correct example.
	next: makeNaturalIterator(),
	[Symbol.iterator]: function () {
		// This iterable may only iterate once because @@iterator returns a
		// reference to the same iterator.
		return this.next
	}
}

for (const n of naturalIterable2) {
	console.log('natural iterable (once) ' + n)
}

for (const n of naturalIterable2) {
	// doesn't output anything, because @@iterator doesn't produce a new
	// iterator.
	console.log('natural iterable (once again) ' + n)
}

// Create an iterable with a generator function.
const countDownIterable = {
	*[Symbol.iterator] () {
		yield '3'
		yield '2'
		yield '1'
		yield 'Blast off!'
	}
}

for (const value of countDownIterable) {
	console.log(value)
}

console.log([...countDownIterable])
// => [ '3', '2', '1', 'Blast off!' ]

const anotherCountDownIterable = {
	*[Symbol.iterator] () {
		yield 'Preparing to launch...'

		// yield* expects an iterable.
		yield* countDownIterable
	}
}

console.log([...anotherCountDownIterable])
// => [ 'Preparing to launch...', '3', '2', '1', 'Blast off!' ]

// THIS is an example of an object that is both an Iterable and an Iterator.
// This is very similar to a generator object (return value of a generator
// function). A generator object is both iterator and iterable.
let foo = {
	i: 0,
	next () {
		return {
			value: this.i++,
			done: this.i > 10
		}
	},
	[Symbol.iterator]: function () {
		return this
	}
}

console.log([...foo]) // => [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
console.log([...foo]) // => []
