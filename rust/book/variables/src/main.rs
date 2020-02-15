fn main() {
    let mut x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);

    // There is a distinction between immutable variables and constant variables. Both are
    // immutable, but the values of constant variables may only be constant expressions --
    // expressions whose values can only be computed at compile-time.
    const MAX_POINTS: u32 = 100_000;
    println!("The value of MAX_POINTS is: {}", MAX_POINTS);
}
