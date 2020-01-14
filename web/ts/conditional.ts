// Goal: provide typing for the following examples:
//
// PASS
//   dispatch('SIMPLE')
//   dispatch('NOT SIMPLE', { foo: 'a foo' })
//   dispatch('ANOTHER NOT SIMPLE', { bar: 'a bar' })
//
// FAIL
//   dispatch('SIMPLE', {})
//   dispatch('NOT SIMPLE')
//   dispatch('NOT SIMPLE', { bar: 'not a foo' })
//
// These are my notes on "Conditional types in TypeScript"
// https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/

// This is a union type of the different messages that can be passed between
// the two execution contexts. Simple actions do not require a second argument
// for a payload.
type Action =
  | {
      type: 'SIMPLE'
    }
  | {
      type: 'NOT SIMPLE',
      foo: string
    }
  | {
      type: 'ANOTHER NOT SIMPLE',
      bar: string
    }

// This is an indexed access type (also called lookup type). They enable access
// to types for provided keys. They distribute over union types, yielding
// another union type.
type ActionType = Action['type']

// ExtractActionParameters is a distributive conditional type. Here, if A is a
// union type, then the condition will distribute over each of its individual
// constituents.
//
// Using never (the bottom type), we can prune the domain of A with a
// condition, so I guess you can think of the following as a type-level filter.
type ExtractActionParameters<A, T> = A extends { type: T }
  ? ExcludeTypeField<A>
  : never

// If K is a union of string-literal types, then ExcludeTypeKey<K> is the set
// difference: K - { "type" }. This is another "filter".
type ExcludeTypeKey<K> = K extends "type" ? never : K

// ExcludeTypeField<A> is a mapped type. Allows definitions of new types from
// properties of existing types.
type ExcludeTypeField<A> = {
  [K in ExcludeTypeKey<keyof A>]: A[K]
}

type ExtractSimpleActions<A> = A extends any
  ? {} extends ExcludeTypeField<A>
    ? A
    : never
  : never

type SimpleActionType = ExtractSimpleActions<Action>["type"]

type ExtractNotSimpleActions<A> = A extends any
  ? {} extends ExcludeTypeField<A>
    ? never
    : A
  : never

type NotSimpleActionType = ExtractNotSimpleActions<Action>["type"]

// Overload the dispatch function to handle arities for the actions that
// require payloads and the actions that do not require payloads.
declare function dispatch(type: SimpleActionType): void
declare function dispatch<T extends NotSimpleActionType>(
  type: T,
  payload: ExtractActionParameters<Action, T>
): void

// TypeScript has builtin Exclude<T, U> and Extract<T, U> utility classes for
// these type transformations.

// These should type check.
dispatch('SIMPLE')
dispatch('NOT SIMPLE', { foo: 'a foo' })
dispatch('ANOTHER NOT SIMPLE', { bar: 'a bar' })

// These should NOT type check.
dispatch('SIMPLE', {})
dispatch('NOT SIMPLE')
dispatch('NOT SIMPLE', { bar: 'not a foo' })
