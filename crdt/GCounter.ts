// Object.values and Object.entries aren't a thing yet until ES2017.
// Use `tsc --lib es2017,dom GCounter.ts` to compile.

export type ReplicaId = string

export interface GCounter {
	readonly id: ReplicaId
	readonly counters: { [k: string]: number }
	readonly value: () => number
	readonly increment: () => void
	readonly merge: (c: GCounter) => void
}

const sum = (a: number, b: number) => a + b

export function createGCounter (id: ReplicaId): GCounter {
	return {
		id,
		counters: {
			[id]: 0
		},
		value () {
			return Object.values(this.counters).reduce(sum, 0) as number
		},
		increment () {
			this.counters[this.id] = (this.counters[this.id] || 0) + 1
		},
		merge (g: GCounter): void {
			Object.entries(g.counters).forEach(([replica, value]) => {
				this.counters[replica] = Math.max(this.counters[replica] || 0, value)
			})
		}
	}
}

const counterA = createGCounter('a')
const counterB = createGCounter('b')

console.log(`initial states
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)

counterA.increment()

console.log(`increment A
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)

counterA.merge(counterB)
counterB.merge(counterA)

console.log(`merge
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)

counterA.increment()
counterB.increment()

console.log(`increment A and B
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)

counterA.merge(counterB)
counterB.merge(counterA)

console.log(`merge
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)

counterA.increment()
counterA.increment()
counterB.increment()
counterB.increment()

console.log(`increment A and B (twice)
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)

counterA.merge(counterB)
counterB.merge(counterA)

console.log(`merge
	a: ${counterA.value()} ${counterA.counters[counterA.id]}
	b: ${counterB.value()} ${counterB.counters[counterB.id]}
`)
