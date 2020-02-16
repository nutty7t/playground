// Slices
//
// How are they different from arrays?
//
// They let you reference a contiguous sequence of elements in a collection rather than the whole
// collection. They do not have ownership.

fn main() {
    let mut s = String::from("hello world");
    let word_end_index = first_word_without_slice(&s);
    let word_book = first_word_book_solution(&s);
    let word = first_word(&s);

    // The book's solution is a better solution because it takes advantage of the reference rules.
    // `s` cannot be cleared. We can't mix immutable borrowing and mutable borrowing.
    //
    // s.clear(); // does not compile

    println!("The end index of the first word is {}", word_end_index);
    println!("The first word is '{}'", word);
    println!("The first word is '{}' (book solution)", word_book);
}

// Returns the last index of the first word of the string.
fn first_word_without_slice(s: &String) -> usize {
    // as_bytes converts a string slice to a byte slice. I imagine that this is a UTF-8 encoding
    // and not a sequence of Unicode scalar values because we use b' ' in the condition below.
    let bytes = s.as_bytes();

    // enumerate maps each value to a tuple, (index, value).
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}

// My attempt at rewriting first_word after learning about string slices.
fn first_word(s: &String) -> String {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return String::from(&s[0..i]);
        }
    }

    String::from(s)
}

// The book's solution is to, rather than construct new String values, return the slice itself.
fn first_word_book_solution(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    // shorthand for returning a full slice
    &s[..]
}
