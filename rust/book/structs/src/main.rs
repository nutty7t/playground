// This seems similar to how you can derive instances of type classes in PureScript and Haskell.
// In order to output Rectangle with the println! macro, we need to implement the `std::fmt::Debug`
// trait. When we do this, we have to use either the {:?} or {:#?} (for pretty-printing) format
// specifiers. The {} format specifier is for user-facing output, and so cannot be derived.
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

// `impl` (or implementation) blocks are where we can define functions within the context of some
// struct. Functions defined in these blocks are called methods.
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    // Functions defined inside of impl blocks that do not have a `self` argument are called
    // associated functions. They're not methods because that don't have an instance of the struct
    // to work with. They are similar to static functions in other languages.
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    let rect2 = Rectangle {
        width: 20,
        height: 30,
    };

    // The `::` syntax is used for both associated functions and namespaces created by modules.
    let _square = Rectangle::square(7);

    println!(
        "The area of the {:#?} is {} square pixels.",
        &rect1,
        // Rust doesn't have the `->` operator like C and C++. Like Go, Rust can automatically
        // reference and dereference pointers on objects.
        rect1.area(),
    );

    println!(
        "Does {:?} fit inside of {:?}? {}",
        rect2,
        rect1,
        if rect1.can_hold(&rect2) {
            "Yes."
        } else {
            "No."
        }
    );
}
