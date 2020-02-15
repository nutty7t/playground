// Ownership Axioms
//
// - Each value in Rust has a variable that's called its *owner*.
// - There can only be one owner at a time.
// - When the owner goes out of scope, the value will be dropped.
//
// Observations
//
// - The ownership axioms still apply to values allocated on the stack. If we have:
//
//     let s1 = 7;
//     let s2 = s1;
//
//   because integers have the `Copy` trait, they have copy semantics. Assignment creates a new
//   value by copying bits. s1 and s2 are both owners to different values.
//
// - The `Drop` trait is related to the RAII pattern in C++, so the `drop` function is analagous to
//   deconstructors in C++.

fn main() {
    let s1 = String::from("hello");

    // This is OK. Cloning will perform a deep copy of the heap data.
    // This creates a *new* value, so s1 doesn't transfer ownership.
    let mut s2 = s1.clone();
    s2 = transfer_and_return_ownership(s2);

    // s1 cannot be used anymore.
    let s3 = s1;

    // s3 cannot be used anymore.
    let _s4 = transfer_ownership(s3);

    println!("s2 = {}", s2);
}

fn transfer_ownership(str: String) {
    println!("Argument is {}", str);

    // Ownership is not transferred back to the caller.
    // str goes out of scope here, and the memory gets freed.
}

fn transfer_and_return_ownership(str: String) -> String {
    str
}
