## State Monad

> Brian Beckman: The Zen of Stateless State - The State Monad
>
> https://www.youtube.com/watch?v=XxzzJiXHOJs&t=1603s

``` haskell
data Tree a = Leaf a | Branch (Tree a) (Tree b)
```

``` haskell
Label :: Tree a -> LabeledTree a
	where LabeledTree a = Tree (S, a)
```

`(S, a)` is a state-content pair.

Inside the function definition of `Label` is an invocation a function with the following signature:

``` haskell
Lab :: Tree a -> S -> (S, LabeledTree a)
```

> I will come back to this. It's a little above me, I think.
