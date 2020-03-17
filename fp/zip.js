// Type signatures are assuming that arrays are homogeneous.

// zip :: [a] -> [b] -> [(a, b)]
const zip = xs => ys => {
	const length = Math.min(xs.length, ys.length)
	return Array(length)
		.fill(null) // need to initialize to some default value
		.map((_, i) => [xs[i], ys[i]])
}

console.log(zip([1, 2, 3])(['a', 'b', 'c', 'd']))
// => [ [ 1, 'a' ], [ 2, 'b' ], [ 3, 'c' ] ]

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith = f => xs => ys => {
	const length = Math.min(xs.length, ys.length)
	return Array(length).fill(null).map((_, i) => {
		return f(xs[i])(ys[i])
	})
}

const sum = x => y => x + y

console.log(zipWith(sum)([1, 2, 3, 4, 5, 6])([2, 4, 6, 8]))
// => [ 3, 6, 9, 12 ]
