// Enums provide a way to give friendly names to sets of numeric values.
// Does that mean that I can use decimal numbers?
enum Color {
	Red   = 1,
	Green = 2,
	Blue  = 3.14,
	Yellow, // inc by 1 from 3.14
	Black = 5,
	White // inc by 1 from 5
}

console.log(Color.Blue)         // Yup! => 3.14
console.log(Color[3.14])        // => "Blue"
console.log(typeof Color[3.14]) // => string
console.log(Color.Yellow)       // => 4.140000000000001 (yikes)
console.log(Color.White)        // => 6

// An alternative perspective: enums can be used to create a bijective mapping
// between a set of strings and a set of numbers.
console.log(typeof Color) // => object
console.log(Color)
// { '1': 'Red',
//   '2': 'Green',
//   '5': 'Black',
//   '6': 'White',
//   Red: 1,
//   Green: 2,
//   Blue: 3.14,
//   '3.14': 'Blue',
//   Yellow: 4.140000000000001,
//   '4.140000000000001': 'Yellow',
//   Black: 5,
//   White: 6 }

enum Conflict {
	Foo = 1,
	Bar,
	Baz = 2
}

// This seems to be OK. But that means that not all enums create bijective
// mappings. Reverse-lookup seems to prefer last assignment.
console.log(Conflict)               // => { '1': 'Foo', '2': 'Baz', Foo: 1, Bar: 2, Baz: 2 }
console.log(Conflict.Bar)           // => 2
console.log(Conflict.Baz)           // => 2
console.log(Conflict[2])            // => Baz
console.log(Conflict[Conflict.Bar]) // => Baz, NOT BIJECTIVE!
