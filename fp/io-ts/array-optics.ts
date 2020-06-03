import { Optional } from 'monocle-ts'
import { indexArray } from 'monocle-ts/lib/Index/Array'

import { pipe } from 'fp-ts/lib/pipeable'

// Can I use optics with arrays?
const animals = ['cat', 'dog', 'monkey']

const optional = Optional.fromNullableProp<string[]>()

console.log(optional(1).getOption(animals))              // => { _tag: 'Some', value: 'dog' }
console.log(optional(0).modify((a) => a + 's')(animals)) // => { '0': 'cats', '1': 'dog', '2': 'monkey' }
console.log(optional(2).set('elephant')(animals))        // => { '0': 'cat', '1': 'dog', '2': 'elephant' }

// The problem with fromNullableProp is that setting or modifying the target
// returns the object representation. Use indexArray instead.
//
// Some other resources to consult for other use cases:
//
// https://github.com/gcanti/monocle-ts/issues/38 (traversal -- update all elements)
// https://github.com/gcanti/monocle-ts/issues/77 (traversal + prism -- target specific elements)

const index = indexArray<string>().index

pipe(
	animals,
	index(2).set('elephant'),
	console.log
	// => [ 'cat', 'dog', 'elephant' ]
)

pipe(
	animals,
	index(2).getOption,
	console.log
	// => { _tag: 'Some', value: 'monkey' }
)
