# Chapter 4

1. Using library functions, define a function `halve :: [a] -> ([a], [a])` that
   splits an even-lenghted list into two halves. For example:

``` haskell
> halve [1, 2, 3, 4, 5, 6]
([1, 2, 3], [4, 5, 6])
```

See `exercises.hs`.

2. Define a function `third :: [a] -> a` that returns the third element in a
   list that contains at least this many elements using:

    a. `head` and `tail`;
    b. list indexing `!!`;
    c. pattern matching.

See `exercises.hs`.

3. Consider a function `safetail :: [a] -> [a]` that behaves in the same way as
   `tail` except that it maps the empty list to itself rather than producing an
   error. Using `tail` and the function `null :: [a] -> Bool` that decides if a
   list is empty or not, define `safetail` using:

    a. a conditional expression;
    b. guarded equations;
    c. pattern matching.

See `exercises.hs`.

4. In a similar way to `&&` in section 4.4, show how the disjunction operator
   `||` can be defined in four different ways using pattern matching.

See `exercises.hs`.

5. Without using any other library functions or operators, show how the meaning
   of the following pattern matching definition for logical conjunction `&&` can
   be formalised using conditional expressions:
   
``` haskell
True && True = True
_    && _    = False
```

Hint: use two nested conditional expressions.
   
See `exercises.hs`.

6. Do the same for the following alternative definition, and note the difference
   in the number of conditional expressions that are required:

``` haskell
True && b = b
False && _ = False
```

See `exercises.hs`.

7. Show how the meaning of the following curried function definition can be
   formalised in terms of lambda expressions:

``` haskell
mult :: Int -> Int -> Int -> Int
mult x y z = x * y * z
```

See `exercises.hs`.

8. The *Luhn algorithm* is used to check bank card numbers for simple errors
   such as mistyping a digit, and proceeds as follows:
   
    - consider each digit as a separate number;
    - moving left, double every other number from the second last;
    - subtract 9 from each number that is now greater than 9;
    - add all the resulting numbers together;
    - it the total is divisible by 10, the card number is valid.
    
Define a function `luhnDouble :: Int -> Int` that doubles a digit and subtracts
9 if the result is greater than 9. For example:

``` haskell
> luhnDouble 3
6

> luhnDouble 6
3
```

Using `luhnDouble` and the integer remainder function `mod`, define a function
`luhn :: Int -> Int -> Int -> Int -> Bool` that decides if a four-digit bank
card number is valid. For example:

``` haskell
> luhn 1 7 8 4
True

> luhn 4 7 8 3
False
```

See `exercises.hs`.
