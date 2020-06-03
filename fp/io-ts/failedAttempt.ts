// My failed attempt at writing a io-ts combinator that creates a codec from
// another codec by renaming properties.

import { flow } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import * as t from 'io-ts'

/**
 * Renames a property on an object.
 *
 * ``` typescript
 * renameProp(['foo', 'bar'], { foo: 7, baz: true })
 * // => { bar: 7, baz: true }
 * ```
 */
const renameProp = <V>(keys: [string, string], obj: { [k: string]: V }) => {
	const [oldKey, newKey] = keys
	const { [oldKey]: value, ...rest } = obj
	return { ...rest, [newKey]: value }
}

const renameProps = <V>(keys: { [k: string]: string }) => (obj: { [k: string]: V }) =>
	flow(Object.entries, A.reduceRight(obj, renameProp))(keys)

/**
 * Combinator for constructing codecs that only rename properties.
 */
export const typeR = <P extends t.Props>(props: P) => (nameMap: {
	[k: string]: string
}): t.TypeC<P> => {
	const From = t.type({ ...props })
	const To = t.type({ ...renameProps<t.Mixed>(nameMap)(props) })

	// i give up
	return new t.Type<t.TypeOf<typeof To>, t.TypeOf<typeof From>, unknown>()
}
