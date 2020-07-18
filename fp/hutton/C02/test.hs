module Chapter2 where

double :: Num a => a -> a
double x = x + x

quadruple :: Num a => a -> a
quadruple = double . double

-- Factorial of a positive integer:
factorial :: (Num a, Enum a) => a -> a
factorial n = product [1..n]

-- Average of a list of integers:
average :: Foldable t => t Int -> Int
average ns = sum ns `div` length ns

two :: Int
two = a `div` length xs
  where
    a = 10
    xs :: [Int]
    xs = [1, 2, 3, 4, 5]

-- wut
last' :: [a] -> a
last' xs = drop (length xs - 1) xs !! 0

-- nice function composition
last'' :: [a] -> a
last'' = head . reverse

-- recursion
last''' :: [a] -> a
last''' [] = error "empty list"
last''' [x] = x
last''' (_ : xs) = last''' xs

init' :: [a] -> [a]
init' = reverse . (drop 1) . reverse

init'' :: [a] -> [a]
init'' xs = take (length xs - 1) xs

-- realized that (drop 1) is tail
init''' :: [a] -> [a]
init''' = reverse . tail . reverse
