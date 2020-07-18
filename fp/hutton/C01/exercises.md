# Chapter 1

1. Give another possible calculation for the result of `double (double 2)`.

```
double (double 2)
double (2 + 2)     { applying the inner double }
(2 + 2) + (2 + 2)  { applying the double }
4 + (2 + 2)        { applying the first + }
4 + 4              { applying the second + }
8                  { applying + }
```

2. Show that `sum [x] = x` for any number `x`.

```
sum [x]
x + sum []  { match against recursive case }
x + 0       { match against base case }
x
```

3. Define a function `product` that produces the product of a list of numbers,
   and show using your definition that `product [2, 3, 4] = 24`.

See `product.hs`.

4. How should the definition of the function `qsort` be modified so that it
   produces a `reverse` sorted version of a list?

See `qsort.hs`.
   
5. What would be the effect of replacing `<=` by `<` in the definition of
   `qsort`? Hint: consider the example `qsort [2, 2, 3, 1, 1]`.

Duplicates elements in the list would be filtered out in the comprehension.
