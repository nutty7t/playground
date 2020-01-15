// I'm fairly familiar with the differences between var, let, and const: the
// scoping, hoisting, destructuring, and assignment rules. But I've learned a
// few more things reading the TS docs.

interface Foo {
	a: number
	b: number
	c: number
	z?: string
}

const foo = {
	a: 100,
	b: 200,
	c: 300
} as Foo

// You can rename variables during object destructuring.
// This is called "property renaming".
const { a: apple, b: banana } = foo
console.log(apple)  // => 100
console.log(banana) // => 200

// You can also set default values in case a property is undefined, but maybe I
// knew this because I've done it in function declarations.
const { z = 'not defined' } = foo
console.log(z)

// Assignment can occur without declaration.
let a: number
let b: number
;({ a, b } = foo)
console.log(a)
console.log(b)

function tdz () {
	//  ^
    //  |
	//
	// This space between the beginning of the block and the declaration of 'a'
	// is called a "temporal dead zone". TECHNICALLY, let and const declarations
	// DO hoist, but don't get initialized. And if you try to access them in the
	// temporal dead zone, you'll get a ReferenceError.
	//
	// The temporal dead zone is where you try to access a variable that has
	// been declared, but it doesn't have a value, not even `undefined`. In
	// contrast, var declarations are hoisted and initialized to `undefined`.
	//
	//  |
	//  v
	let a = 'hi'
	console.log(a)
}
