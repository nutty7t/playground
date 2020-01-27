// fromX and fromY are isomorphic functors between X and Y.
//
// If X and Y are structurally equivalent, then we should be able to just use
// the identity function to map between them. The following example
// demonstrates a type-safe way of encoding this guarantee. If ever the
// interface of X or Y is modified so that X is not assignable to Y or Y is not
// assignable to X, then fromX and fromY will fail to compile.

interface Foo {
	a: string
	b: number
}

interface Bar extends Foo {
	// uncommenting will raise a type error
	// c: boolean
}

function identity<T>(x: T): T {
	return x
}

// Mapping functions (or functors)
// Will raise a type error if Foo and Bar are not structurally equivalent.
//
// These are basically assertions that Foo is assignable to Bar (and the
// converse) wrapped around an identity function.
const fromFoo = (x: Foo) => identity<Bar>(x)
const fromBar = (x: Bar) => identity<Foo>(x)
