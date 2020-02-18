fn main() {
    let s = String::new();
    let data = "initial contents";

    // These two are equivalent.
    let mut s = data.to_string();
    s = String::from("initial contents");

    // Appending a string.
    s.push_str(" :: some more contents");
    println!("{}", s);

    // Appending a character.
    s.push('!');
    println!("{}", s);

    // Using the `+` operator. This requires an ownership of a string in the left operand and a
    // reference in the right operand. `+` takes ownership of the left argument and appends a copy
    // of the contents of the right argument.
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    // This will move s1 into the scope of `+` and get dropped.
    let s3 = s1 + &s2;
    println!("{}", s3);

    // For more complicated string combining, we can use the format! macro.
    // format! is easy to read and doesn't take ownership of any of its parameters.
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");
    // format! is like the sprintf of Rust.
    let s = format!("{}-{}-{}", s1, s2, s3);
    println!("{}", s);

    // A String is a wrapper over a Vec<u8>.
    let len = String::from("Hola").len();
    println!("{}", len); // => 4

    // Some UTF-8 characters take up more than one byte.
    let len = String::from("こんにちは").len();
    println!("{}", len); // => 15

    // Iterating over characters.
    for c in "こんにちは".chars() {
        println!("{}", c);
    }

    // Iterating over the raw bytes.
    for b in "こんにちは".bytes() {
        println!("{:b}", b);
    }
}
