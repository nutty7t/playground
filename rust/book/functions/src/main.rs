fn main() {
    // Rust makes an important distinction between *statements* and *expressions*.
    //
    // Statements - instructions that perform some action and do not return a value.
    // Expressions - evaluate to a resulting value.
    //
    // Assignment is a statement, so you can't chain them like you can in C.
    //
    //     let x = (let y = 6); // not allowed
    //
    // Rust is an expression-based language.
    let x = 5;

    let y = {
        // start of block expression
        let x = 3; // shadows x in enclosing scope
        x + 1 // NO SEMICOLON (otherwise, it becomes a statement)
    }; // end of block expression

    println!("x is {}", x);
    println!("y is {}", y);

    // I had a hypothesis that statements were just expressions that evaluated to the unit type,
    // but I don't think that's the case. Otherwise, `let x: () = (let y = 6);` should work.
    //
    // edit: I just learned that `()` is an empty tuple. Is that the same as the unit type?
    let _foo: () = {
        5;
    };

    let _bar: () = ();

    println!("{}", hello_world())
}

fn hello_world() -> String {
    // similar to haskell, doesn't need `return` keyword
    //
    // `return` is used for early exits.
    "hello world".to_string()
}
