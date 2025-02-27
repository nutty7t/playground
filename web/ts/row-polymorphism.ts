// I'm trying to understand the differences between structural subtyping and
// row polymorphism.

interface Example {
	foo: boolean
	bar: number
}

interface Example2 extends Example {
	baz: string
}

function processFoo(e: Example) {
	e.bar++
	return e
}

// Excess property checking -- doesn't work here unless we type assert
processFoo({
	foo: true,
	bar: 7,
	baz: 'what',
} as Example2)

const test = {
	foo: true,
	bar: 7,
	baz: 'what',
}

const test2 = processFoo(test)
test2.baz // [tsserver 2339] [E] Property 'baz' does not exist on type 'Example'.

// The type of test2 is inferred to be `Example` and not `Example2`.
// Some type information is lost, which makes me think that this is structural
// subtyping and not row polymorphism. There's no polymorphic type variable
// that preserves type information. But maybe we can do something else by
// combining structural subtyping with parametric polymorphism

const processFoo2 = <T extends Example>(e: T): T => {
	e.bar++
	return e
}

const test3 = processFoo2(test)
test3.baz // WORKS!
