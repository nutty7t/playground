fn main() {
    // `if` control flow is just like any other language.
    // But in Rust, it's an expression!
    let condition = true;
    let number = if condition { 5 } else { 6 };
    println!("The value of number is: {}", number);

    // Loops are also expressions.
    // You can return values from loops when you break.
    let mut counter = 0;
    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {}", result);

    // `while` loops are the same as other languages.

    // `for` loops are used to loop through the elements of a collection.
    let collection = [10, 20, 30, 40, 50];
    for element in collection.iter() {
        println!("The value is: {}", element)
    }
    // Can use `rev` to reverse a collection.
    for element in collection.iter().rev() {
        println!("The value is: {}", element)
    }
}
