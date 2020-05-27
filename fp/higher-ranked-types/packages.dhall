let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.13.6-20200507/packages.dhall sha256:9c1e8951e721b79de1de551f31ecb5a339e82bbd43300eb5ccfb1bf8cf7bbd62

let overrides = {=}

let additions =
  { numerics =
      { dependencies =
        [ "prelude"
        , "integers"
        , "rationals"
        , "uint"
        , "bigints"
        ]
      , repo =
          "https://github.com/proclivis/purescript-numerics.git"
      , version =
          "v0.1.2"
      }
  }

in  upstream // overrides // additions
