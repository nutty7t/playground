// Hypothesis: Function return types have their domain implicitly extended with
// `never` under a union. This makes sense to me because TypeScript is
// non-total. I wonder if it also makes sense because `never` is a bottom type
// and is the subtype of all types.

function foo (): boolean | never {
	if (Math.random() < 0.5) {
		throw 'exception'
	}
	return true
}

function bar (): boolean {
	if (Math.random() < 0.5) {
		throw 'exception'
	}
	return true
}

function baz (): never {
	throw 'exception'
}

// behaves the same
const test: boolean = foo()
const test2: boolean = bar()

const bottom: never = baz()
