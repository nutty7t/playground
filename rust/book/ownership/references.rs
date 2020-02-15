// It can be rather tedious to explicitly transfer ownership of a value to and from a function.
// *References* allow you to refer to some value without taking ownership of it.
//
// When we have references as function parameters, we call this *borrowing*. Why is it called this?
// Well, when we borrow something, we have to give it back. The following code will fail:
//
//     let mut s = String::from("hello");
//     let r1 = &mut s;
//     let r2 = &mut s;
//     println!("{}, {}", r1, r2);
//
// Rust restricts mutation in order to prevent data races at compile time.
//   - Two or more pointers access the same data at the same time.
//   - At least one of the pointers is being used to write to the data.
//   - There's no mechanism being used to synchronize access to the data.
//
// We can create block scopes for allowing multiple mutable references.
//
//     let mut s = String::from("hello");
//     { let r1 = &mut s; } // r1's scope is limited to this line,
//     let r2 = &mut s;     // so it's perfectly OK to make a new reference here.
//
// And finally, we can't have a mutable reference when there exists an immutable one.
// It's hard to reason about immutable references when the values change underneath.
//
// Reference Axioms:
// - At any given time, you can have either one mutable reference or any number of immutable
//   references.
// - References must always be valid. Rust will ensure at compile time that dangling references do
//   not exist in the program.

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);

    // We can only borrow s2 if it is a mutable variable.
    let mut s2 = String::from("hello");
    change(&mut s2);
    println!("The value of s2 is '{}'", s2);
}

fn calculate_length(s: &String) -> usize {
    // When s goes out of scope, nothing happens to the value that s points to.
    // References are immutable by default, so we can't mutate s in this function.
    s.len()
}

fn change(some_string: &mut String) {
    some_string.push_str(", world!");
}
