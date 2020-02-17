// Enums -- first thoughts
//
// - "Enums allow you to define a type by enumerating its possible variants."
//   - these seem really similar to algebraic data types
//   - the Option type is the Maybe type
//   - sum types!
//   - makes sense -- enumerations are like unions of single values.
fn main() {
    let home = IpAddr::V4(String::from("127.0.0.1"));
    let loopback = IpAddr::V6(String::from("::1"));

    println!("The home address is {:?}", home);
    println!("The loopback address is {:?}", loopback);

    home.call();
    loopback.call();

    let x = Some(2);
    let y = Some(7);
    let z = None;

    println!("add");
    println!("{:?} + {:?} = {:?}", x, y, add(x, y));
    println!("{:?} + {:?} = {:?}", x, z, add(x, z));
    println!("{:?} + {:?} = {:?}", y, z, add(y, z));

    println!("add_if_let");
    println!("{:?} + {:?} = {:?}", x, y, add_if_let(x, y));
    println!("{:?} + {:?} = {:?}", x, z, add_if_let(x, z));
    println!("{:?} + {:?} = {:?}", y, z, add_if_let(y, z));
}

// This is an enumerated type that is commonly found in a lot of languages.
// A special case of sum types in which the data constructors take no arguments.
enum Degrees {
    Fahrenheit,
    Celsius,
}

// But in Rust, we can define data constructors that accept values.
//
// To do this in TypeScript, we might define a discriminated union type where each of the variants
// of the union type are class constructors. And then to work with the type, we can define type
// guards that assert the type of the class constructors.
//
// So here, V4 and V6 are data constructors. IpAddr is a type constructor of kind `*`. I haven't
// gotten to generics in Rust yet, but I imagine that if we introduce a type variable like in
// Option<T>, we get a type constructor of kind `* -> *`.
#[derive(Debug)]
enum IpAddr {
    V4(String),
    V6(String),
}

// enums can have `impl` blocks too!
impl IpAddr {
    fn call(&self) {
        println!("inside enum method: {:?}", self);
    }
}

// Let's practice pattern matching with the Option<T> type.
// It works just like in Haskell.
fn add(x: Option<i32>, y: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(x) => match y {
            None => None,
            Some(y) => Some(x + y),
        },
    }
}

// Rewriting the add function using the `if let` syntax.
// It's more concise, but it loses the exhaustive checking.
// Is it worth the trade-off?
fn add_if_let(x: Option<i32>, y: Option<i32>) -> Option<i32> {
    if let Some(x) = x {
        if let Some(y) = y {
            return Some(x + y);
        }
    }
    None
}
