# Chapter 2

1. Parenthesise the following arithmetic expressions:

``` haskell
2 ^ 3 * 4 == ((2 ^ 3) * 4)
2 * 3 + 4 * 5 == ((2 * 3) + (4 * 5))
2 + 3 * 4 ^ 5 == (2 + (3 * (4 ^ 5)))
```

2. Work through the examples from this chapter using Hugs.

Done, but I used GHC instead.

3. The script below contains three syntactic errors. Correct these errors and
   then check that your script works properly using Hugs.

``` haskell
N = a 'div' length xs
    where
      a = 10
     xs = [1, 2, 3, 4, 5]
```

- `N` must start with a lowercase character.
- `'div'` needs to be surrounded with backticks.
- `xs` is not aligned with `a`.

4. Show how the library function `last` that selects the last element of a
   non-empty list could be defined in terms of the library functions introduced
   in this chapter. Can you think of another possible definition?
   
See `test.hs`.
   
5. Show how the libary function `init` that removes the last element from a
   non-empty list could similarly be defined in two different ways.
