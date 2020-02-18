fn main() {
    // To create a new, empty vector, we can call the Vec::new function.
    let v: Vec<i32> = Vec::new();
    println!("{:?}", v);

    // If we want to create a new vector initialized with elements, we can use the macro.
    let mut v = vec![1, 2, 3];
    println!("{:?}", v);

    // Adding elements to a vector. The variable owning the vector has to be mutable.
    v.push(4);
    v.push(5);
    println!("{:?}", v);

    // Reading elements of a vector. We can simply index the vector...
    // What's the difference between the following?
    let _third: i32 = v[2];
    let third: &i32 = &v[2];
    println!("The third element of {:?} is {}", v, third);

    // ...but that could cause the program to panic of the index is out of bounds.
    // It's safer to pattern match against the indexing operation with the `get` method.
    match v.get(2) {
        Some(third) => println!("The third element is {}", third),
        None => println!("There is no third element."),
    }

    // Iterating over the elements of a vector.
    for i in &v {
        println!("{}", i);
    }

    // We can also mutate the values while iterating.
    for i in &mut v {
        *i += 50;
    }
    println!("{:?}", v)
}
