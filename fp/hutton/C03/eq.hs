{-# LANGUAGE FlexibleInstances #-}

module Chapter3 where

instance Eq (Bool -> Bool) where
  f == g = (f True == g True) && (f False && g False)
