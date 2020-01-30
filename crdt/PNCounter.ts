// Object.values and Object.entries aren't a thing yet until ES2017.
// Use `tsc --lib es2017,dom PNCounter.ts` to compile.

import { GCounter, ReplicaId, createGCounter } from './GCounter'

type CounterType = 'positive' | 'negative'

interface PNCounter {
	readonly id: ReplicaId
	readonly counters: {
		[k: string]: {
			positive: GCounter,
			negative: GCounter
		}
	}
	readonly value: () => number
	readonly increment: () => void
	readonly decrement: () => void
	readonly merge: (c: PNCounter) => void
}

const sum = (a: number, b: number) => a + b

export function createPNCounter (id: ReplicaId): PNCounter {
	return {
		id,
		counters: {
			[id]: {
				positive: createGCounter(id),
				negative: createGCounter(id)
			}
		},
		value () {
			function sumGCounters (t: CounterType): number {
				return Object
					.values(this.counters)
					.map((c: any) => c[t].value())
					.reduce(sum, 0) as number
			}
			return sumGCounters.bind(this)('positive') - sumGCounters.bind(this)('negative')
		},
		increment () {
			this.counters[this.id].positive.increment()
		},
		decrement () {
			this.counters[this.id].negative.increment()
		},
		merge (p: PNCounter): void {
			Object.entries(p.counters).forEach(([replica, g]) => {
				if (!(replica in this.counters)) {
					this.counters[replica] = {
						positive: createGCounter(replica),
						negative: createGCounter(replica)
					}
				}
				this.counters[replica].positive.merge(g.positive)
				this.counters[replica].negative.merge(g.negative)
			})
		}
	}
}

const counterA = createPNCounter('a')
const counterB = createPNCounter('b')

console.log(`initial states
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)

counterA.increment()
counterA.decrement()

console.log(`increment and decrement A
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)

counterA.merge(counterB)
counterB.merge(counterA)

console.log(`merge
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)

counterA.increment()
counterB.increment()

console.log(`increment A and B
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)

counterA.decrement()
counterA.decrement()
counterB.decrement()
counterB.decrement()

console.log(`decrement A and B (twice)
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)


counterA.increment()
counterA.increment()
counterA.increment()
counterA.increment()

console.log(`increment A (four times)
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)

counterA.merge(counterB)
counterB.merge(counterA)

console.log(`merge
	a: ${counterA.value()} ${counterA.counters[counterA.id].positive.value()} ${counterA.counters[counterA.id].negative.value()}
	b: ${counterB.value()} ${counterB.counters[counterB.id].positive.value()} ${counterB.counters[counterB.id].negative.value()}
`)
