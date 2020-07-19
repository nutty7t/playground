module Chapter4 where

halve :: [a] -> ([a], [a])
halve xs = (take half xs, drop half xs)
  where
    half = length xs `div` 2

third :: [a] -> a
third = head . tail . tail

third' :: [a] -> a
third' = (!! 3)

third'' :: [a] -> a
third'' (_ : (_ : (n : _))) = n
third'' _ = error "list is too short"

safetail :: [a] -> [a]
safetail xs = if null xs then tail xs else []

safetail' :: [a] -> [a]
safetail' xs | null xs = []
             | otherwise = tail xs

safetail'' :: [a] -> [a]
safetail'' [] = []
safetail'' xs = tail xs

(|||) :: Bool -> Bool -> Bool
False ||| False = False
False ||| True  = True
True  ||| False = True
True  ||| True  = True

(||||) :: Bool -> Bool -> Bool
False |||| False = False
_     |||| _     = True

(|||||) :: Bool -> Bool -> Bool
p ||||| q | p = True
          | q = True
          | otherwise = False

(||||||) :: Bool -> Bool -> Bool
False |||||| q = q
True  |||||| _ = True

and' :: Bool -> Bool -> Bool
p `and'` q =
  if p
  then
    if q
    then True
    else False
  else False

and'' :: Bool -> Bool -> Bool
p `and''` q = if p then q else False

or' :: Bool -> Bool -> Bool
p `or'` q =
  if p
  then True
  else
    if q
    then True
    else False

or'' :: Bool -> Bool -> Bool
p `or''` q = if not p then q else True

mult :: Int -> Int -> Int -> Int
mult = (\x -> (\y -> (\z -> x * y * z)))

luhnDouble :: Int -> Int
luhnDouble x = if double > 9 then double - 9 else double
  where
    double = x + x

luhn :: Int -> Int -> Int -> Int -> Bool
luhn a b c d = result `mod` 10 == 0
  where
    result = sum [luhnDouble a, b, luhnDouble c, d]
