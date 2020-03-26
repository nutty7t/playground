// npx tsc --lib ES2015,dom api.ts && node api.js

import { flow } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as M from 'fp-ts/lib/Monoid'

import { failure } from 'io-ts/lib/PathReporter'
import * as t from 'io-ts'

import axios, { AxiosResponse } from 'axios'

// ----------------------------------------------------------------------------
//  Some runtime type definitions
// ----------------------------------------------------------------------------

// io-ts lets you define runtime types -- this means that we can validate types at runtime.
// Complex types can be composed from smaller type constructor combinators.
//
// Suppose that this is the server representation of a todo list item.
const Todo = t.type({
	userId: t.number,
	id: t.number,
	title: t.string,
	completed: t.boolean,
})

// We can extract the static type from the runtime type.
type Todo = t.TypeOf<typeof Todo>

// Suppose that this is the client representation of a todo list item.
const WeirdTodo = t.type({
	combinedId: t.string,
	reversedTitle: t.string,
	notCompleted: t.boolean,
})

type WeirdTodo = t.TypeOf<typeof WeirdTodo>

// ----------------------------------------------------------------------------
//  We can use a codec to define an isomorphic interface between the client
//  representation and the server representation.
// ----------------------------------------------------------------------------

const typeGuard = <(u: unknown) => u is WeirdTodo>(u => {

	// [*] At this moment, u is unknown. So here is the question that Zach and
	// I struggled with earlier: How do we validate u if we don't know anything
	// about it? The answer is to use type guards!
	if (WeirdTodo.is(u)) {
		// [*] Here, u is WeirdTodo because we made it past the type guard. Now
		// we can access properties on u.

		// Let's check if u.combinedId is two strings concatenated by tilde and
		// that each string is an encoding of an integer value. This dummy
		// check represents some arbitrary runtime check that would normally
		// take place in real code.
		const ids = u.combinedId.split('~')
		return M.fold(M.monoidAll)([
			ids.length === 2,
			...ids.map(/\d+/.test),
		])
	}

	// Didn't pass the type guard.
	return false
})

const validator = (u: unknown, c: t.Context): E.Either<t.Errors, WeirdTodo> => {
	// console.log(u)
	return E.either.map(
		Todo.validate(u, c),
		todo => ({
			combinedId: `${todo.id}~${todo.userId}`,
			reversedTitle: todo.title.split('').reverse().join(''),
			notCompleted: !todo.completed,
		})
	)
}

const encoder = (todo: WeirdTodo): Todo => {
	const [id, userId] = todo.combinedId.split('~').map(Number)
	const title = todo.reversedTitle.split('').reverse().join('')
	const completed = !todo.notCompleted
	return { id, userId, title, completed }
}

// This is a rough notion of an isomorphism. E.g. JSON.parse and JSON.stringify.
// (encode ∘ decode === id<O>) and (decode ∘ encode === id<A>) in *most* cases.
const TodoIsomorphism = new t.Type<WeirdTodo, Todo, unknown>(
	'todo',
	typeGuard,
	validator,
	encoder,
)

// ----------------------------------------------------------------------------
//  OK! Let's try using some of these types!
// ----------------------------------------------------------------------------

const fetchTodoById = (id: number) => TE.tryCatch<Error, AxiosResponse>(
	() => axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`),
	(reason: unknown) => new Error(String(reason)),
)

const reportErrors = (errors: t.Errors): Error => {
	return new Error(failure(errors).join('\n'))
}

const getTodo = flow(
	fetchTodoById,
	TE.map(r => r.data),
	TE.chain(u => pipe(
		TodoIsomorphism.decode(u),
		E.mapLeft(reportErrors),
		TE.fromEither,
	))
)

async function main() {
	const getThirdTodo = getTodo(3)
	const result = await getThirdTodo()

	// Woohoo! We did it! Bi-directional mapping between the client and the
	// server with runtime type checking!

	if (E.isRight(result)) {
		const thirdTodo: WeirdTodo = result.right
		console.log(thirdTodo)
		// { combinedId: '3~1',
		//   reversedTitle: 'sunim mainev taiguf',
		//   notCompleted: true }

		console.log(TodoIsomorphism.encode(thirdTodo))
		// { id: 3,
		//   userId: 1,
		//   title: 'fugiat veniam minus',
		//   completed: false }
	}
}

main()
