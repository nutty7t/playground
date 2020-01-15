interface Musician {
	instrument: string
}

function plays (m: Musician): string {
	return m.instrument
}

// Excess property checking -- only happens when argument is object literal.
plays({ instrument: 'violin', part: '2' })             // doesn't type check
plays({ instrument: 'violin', part: '2' } as Musician) // OK, bypass with type assertion

const musician = { instrument: 'sax', voice: 'alto' }
plays(musician) // OK, not an object literal

interface Musician2 extends Musician {
	// This index signature makes Musician2 an indexable type.
	[index: string]: any
}

function plays2 (m: Musician2): string {
	return m.instrument
}

plays2(musician) // OK, type definition allows excess properties

// We can provide names for function types.
// Just give the interface a call signature.
interface AccessorFunc {
	(m: Musician): string
}

const fn: AccessorFunc = plays        // OK, type checks
const fn2: AccessorFunc = console.log // type mismatch

interface StringIndexable {
	[index: string]: string
}

const tryToBreakStringIndexable: StringIndexable = {
	1: 'one',
	2: 'two',
	// THIS BREAKS! Numeric indices are converted to strings before being
	// indexed into the object. typeof true !== 'string'
	3: true,
	tree: 'branch'
}

interface NumberIndexable {
	[index: number]: boolean
}

const tryToBreakNumberIndexable: NumberIndexable = {
	1: 'one', // BAD
	2: 'two', // BAD
	3: false,
	tree: 'branch' // OK, 'tree' is not numeric
}

// An interface may have both index signatures (for number and string), but the
// number indexer must be a subtype of the string indexer. This is because the
// numbers are converted to strings.
interface BothIndexable {
	[index: number]: number
	[index: string]: string | number
}

interface BothIndexableBad {
	[index: number]: string | number // BAD
	[index: string]: string
}

interface ROArray {
	readonly [index: number]: any
}

const arr: ROArray = []
arr[0] = true          // NOPE, readonly
arr['tree'] = 'branch' // OK, not a numeric index, but would not be OK if we used a string indexer.
