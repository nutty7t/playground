# Chapter 3

1. What are the types of the following values?

``` haskell
['a', 'b', 'c'] -- [Char]
('a', 'b', 'c') -- (Char, Char, Char)
[(False, '0'), (True, '1')] -- [(Bool, Char)]
([False, True], ['0', '1']) -- ([Bool], [Char])
[tail, init, reverse] -- [[a] -> [a]]
```

2. What are the types of the following functions?

``` haskell
second xs = head (tail xs) -- [a] -> a
swap (x, y) = (y, x) -- (a, b) -> (b, a)
pair x y = (x, y) -- a -> b -> (a, b)
double x = x * 2 -- Num a => a -> a
palindrome xs = reverse xs == xs -- Eq a => [a] -> Bool
twice f x = f (f x) -- (a -> a) -> a -> a
```

Hint: take care to include the necessary class constraints if the functions are
defined using overloaded operators.

3. Check your answers to the preceding two questions using Hugs.

I got the type of `palindrome` wrong: forgot the `Eq a` type constraint.

4. Why is it not feasible in general for function types to be instances of the
   `Eq` class? When is it feasible? Hint: two functions of the same type are
   equal if they always return equal results for equal arguments.

To test if two functions are equal, all possible inputs would have to be
enumerated and applied to the functions. If the domain is infinite, then it is
impossible. But even if it a finite domain, it is probably impractical. We can
define `Eq` instances for functions with small domains. See `eq.hs`.
