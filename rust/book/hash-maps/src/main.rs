use std::collections::HashMap;

fn main() {
    // Create a hash map and insert some K-V pairs.
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    println!("{:?}", scores);

    // Hash maps can also be constructed from tuples.
    let teams = vec![String::from("Blue"), String::from("Red")];
    let initial_scores = vec![10, 50];
    // zip takes two iterators and returns a new iterator of tuple pairs.
    // collect transforms an iterator into a collection.
    //
    // It's possible to collect into many different data structures and Rust doesn't know which you
    // want unless you specify. That's why we need HashMap<_, _>.
    let mut scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
    println!("{:?}", scores);

    // Accessing values in a hash map.
    let key = String::from("Blue");
    println!("The value at {} is {:?}", key, scores.get(&key));

    // Iterating over a hash map. Like in Go, this code will iterate over the K-V pairs in an
    // arbitrary order.
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }

    // Overwritting a value.
    scores.insert(&key, &100);
    println!("{:?}", scores);

    // Only inserting a value if the key has no value.
    let another_key = String::from("Yellow");
    scores.entry(&key).or_insert(&1000);
    scores.entry(&another_key).or_insert(&25);
    println!("{:?}", scores);

    // Updating a value based on the old value.
    let text = "hello hello wonderful world";
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
    println!("{:?}", map);
}
