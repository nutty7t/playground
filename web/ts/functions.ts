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

// `this` is bound at call time, but there is a pattern that allows
// for a persistent `this` value. This is achieved with closures.
const boundHello = function (thing: string) {
	return person.hello.call(person, thing)
}

boundHello('world')
// desugars to boundHello(undefined, 'world'), but `this` immediately gets
// rebound to `person`, which got captured in the closure.

// More generally,
function bind (fn: Function, thisValue: any) {
	return function () {
		// apply is the same as call, but the arguments are passed as an array
		return fn.apply(thisValue, arguments)
	}
}

// This was a common idiom so ES5 introduced bind on all Function objects.
person.hello.bind(person)('world')
