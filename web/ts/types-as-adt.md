Types make up a semiring:

``` typescript
// union types -- (T, |) is a commutative monoid with identity element, never.
// T1 == T2 (associative). T3 == T4 (commutative). T5 and T6 reduce to T7. A
// union between set A and an empty set is A.
type T1 = boolean | null
type T2 = null | boolean
type T3 = (int | boolean) | null
type T4 = int | (boolean | null)
type T5 = boolean | never
type T6 = never | boolean
type T7 = boolean

// product types -- (T, []) is a monoid with identity element (null or undefined).
// Does that mean that null and undefined are both unit types? Both are singletons.
// T7 and T8 have the same domains (associative). T9 and T10 are isomorphic to T11
// by annihiliation.
type T7 = [int, boolean]
type T8 = [boolean, int]
type T9 = [null, boolean]
type T10 = [boolean, null]
type T11 = boolean

// One of the properties of a semiring is that products distribute over sums.
// How would that work? T12 == T13 and T14 == T15.
type T12 = [string, boolean | int]
type T13 = [string, boolean] | [string, int] // left distributive
type T14 = [boolean | int, string]
type T15 = [boolean, string] | [int, string] // right distributive
```

So, `any` and `unknown` are top types. `null` and `undefined` (update: wait,
there's also `void`!) are unit types.  `never` is a bottom type. It seems to me
that viewing types as an algebra helps a lot when thinking about type level
programming in TypeScript. For example, I recently learned about distributive
conditional types: `T extends U ? X : Y`.  If `T` is a naked type parameter
that is a union type, then the conditional types are distributed over the
individual constituents of `T`. One way to think about this operation is
`foldMap :: Monoid m => (a -> m) -> t a -> m`. `(a -> m)` maps each contituent
type in `T` to another type. If we remember that types form a monoid under `|`
and `never`, it makes a lot of sense that we can make `(a -> m)` map types to
themselves or `never` based on whether `T` is assignable to `U` to implement
`Exclude<U, T>` and `Extract<U, T>`. In psuedocode:

``` haskell
--                 <union>
exclude :: Type -> T Type -> Type
exclude U = foldMap $ assignable U
```

In the context of these utility methods, it makes sense how `never` can be
useful as an additive identity under `|`. We can refine union types by mapping
elements to exclude to the `never` type and let `|` do the work.

Now, consider the category of these types with functions as morphisms. This
category forms a monoidal category, which enables cool things to be defined
(i.e. applicative functors and monads, which are great abstractions for
general computations). This part is a bit of abstract nonsense to me, but I
hope to get a better understanding of it in the future.
