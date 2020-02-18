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

    // Exercise 1
    println!("{:?}", mmm(&[1, 2, 3, 4, 5, 5]));
    println!("{:?}", mmm(&[3, 4, 2, 1, 5, 5]));
    println!("{:?}", mmm(&[]));

    // Exercise 2
    println!("{:?}", pig_latin("the rust programming language ナッティ"));
}

#[derive(Debug)]
enum Result {
    Int(i32),
    Float(f64),
}

/// Given a list of integers, use a vector and return the mean (the average value), median (when
/// sorted, the value in the middle position), and mode (the value that occurs most often; a hash
/// map will be helpful here) of the list.
fn mmm(list: &[i32]) -> Option<Vec<Result>> {
    match list.len() {
        0 => None,
        _ => {
            // Mean
            let mut sum = 0;
            for i in list {
                sum += i
            }
            let mean = (sum as f64) / (list.len() as f64);

            // Median
            let mut sorted_list: Vec<i32> = list.iter().copied().collect();
            sorted_list.sort();
            let median = sorted_list[list.len() / 2];

            // Mode
            let mut frequencies = HashMap::new();
            let mut mode = 0;
            let mut max_count = 0;
            for &i in list {
                let count = frequencies.entry(i).or_insert(0);
                *count += 1;

                if *count > max_count {
                    max_count = *count;
                    mode = i;
                }
            }

            Some(vec![
                Result::Float(mean),
                Result::Int(median),
                Result::Int(mode),
            ])
        }
    }
}

/// Convert strings to pig latin. The first consonant of each word is moved to the end of the word
/// and “ay” is added, so “first” becomes “irst-fay.” Words that start with a vowel have “hay”
/// added to the end instead (“apple” becomes “apple-hay”). Keep in mind the details about UTF-8
/// encoding!
fn pig_latin(words: &str) -> String {
    let mut pig_latin_words = Vec::new();
    let words = words.split_whitespace();
    for w in words {
        let mut chars: Vec<char> = w.chars().collect();
        let head = chars.remove(0);
        let tail: String = chars.into_iter().collect();
        let pig_latin_word = format!("{}-{}ay", tail, head);
        pig_latin_words.push(pig_latin_word);
    }
    pig_latin_words.join(" ")
}
