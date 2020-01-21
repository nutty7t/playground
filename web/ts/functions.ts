// Understanding `this` in two steps:
//
//   1. Understand the core function invocation primitive: `call`.
//   2. Observe how different function invocations desugar to `call`.

'use strict' // play around with strict/non-strict mode

function hello (thing: string) {
	console.log(this + ' says hello ' + thing)
}

// fn.call(this, ...arguments)
hello.call('nutty', 'world')
// => nutty says hello world

hello('world')
// desugars to hello.call(undefined, 'world') in strict mode
// desugars to hello.call(window, 'world') in browsers (non-strict)
// desugars to hello.call(global, 'world') in node.js (non-strict)

const person: { [k: string]: any } = {
	name: 'nutty',
	hello: function (thing: string) {
		console.log(this.name + ' says hello ' + thing)
	}
}

person.hello('world')
// desugars to person.hello.call(person, 'world')

// demonstrates that `this` is bound at call time
person.dynamicHello = hello
person.dynamicHello('world')
// desugars to person.hello.call(person, 'world')
