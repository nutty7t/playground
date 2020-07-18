module Chapter1 where

qsort :: Ord a => [a] -> [a]
qsort [] = []
qsort (x : xs) = qsort smaller ++ [x] ++ qsort larger
  where
    smaller = [a | a <- xs, a <= x]
    larger = [b | b <- xs, b > x]

reverseSort :: Ord a => [a] -> [a]
reverseSort [] = []
reverseSort (x : xs) = reverseSort larger ++ [x] ++ reverseSort smaller
  where
    smaller = [a | a <- xs, a <= x]
    larger = [b | b <- xs, b > x]
