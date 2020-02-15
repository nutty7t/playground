// This seems similar to the C++'s namespaces.
// If we omit the `use` statement, we can refer to
// std::io::stdin instead.
//
// Or is it more like ES6 modules?
// > import { thread_rng, Rng } from rand
// > import { io } from std
//
// Rng is a trait. I hear that traits are similar to type classes.
use rand::{thread_rng, Rng};
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = thread_rng().gen_range(1, 101);

    loop {
        println!("Please input your guess.");

        // Variables are immutable by default.
        // To make them mutable, we must include the `mut` keyword.
        let mut guess = String::new();

        io::stdin()
            // References are immutable by default, so we need to
            // use `&mut` to make them mutable.
            //
            // std::io::stdin returns an io::Result type.
            //
            //   type Result<T> = Result<T, Error>;
            //
            // This reminds me a lot of Haskell's Either type.
            .read_line(&mut guess)
            // expect unwraps a result if the instance of io::Result is Ok.
            // Otherise it will panic with an error message if the instance is Err.
            .expect("Failed to read line");

        // This variable, guess, is a *different* variable from the
        // other guess. Variable shadowing.
        //
        // parse is a generic method, but it can infer the instance
        // from the type declaration.
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
