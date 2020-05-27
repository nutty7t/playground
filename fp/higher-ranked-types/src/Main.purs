module Main where

import Prelude (Unit)

import Effect (Effect)
import Effect.Console (log)

import Data.Num (class Num)
import Data.Tuple (Tuple(..))

-- The following function does not work. We're trying to bind `a` to Int and
-- String at the same time. (Prenex Form)
--
-- function :: forall a. (a -> a) -> Tuple Int String -> Tuple Int String
-- function f (Tuple i s) = Tuple (f i) (f s)

-- This works. The binding of `a` is deferred. Here, `a` gets bound in two
-- different call sites. (Rank 2)
function :: (forall a. a -> a) -> Tuple Int String -> Tuple Int String
function f (Tuple i s) = Tuple (f i) (f s)

-- The following function does not work.
--
-- addBoth :: forall a. Num a => (a -> a) -> Tuple Int Number -> Tuple Int Number
-- addBoth f (Tuple i n) = Tuple (f i) (f n)

-- This works.
addBoth :: (forall a. Num a => a -> a) -> Tuple Int Number -> Tuple Int Number
addBoth f (Tuple i n) = Tuple (f i) (f n)

main :: Effect Unit
main = do
  log "Rank N Types"
