// src/main.rs and src/lib.rs are *crate roots*.
// There can only be one lib root per crate.
// If a create has multiple binaries, the roots are in src/bin/.
// Called crate roots because they are the root of a crate's module tree.
//
// Use modules to group related definitions together and name why they're related.
// Modules also facilitate hiding of implementation details. Private by default.
//
//   crate
//    └ front_of_house
//        ├ hosting
//        │   ├ add_to_waitlist
//        │   └ seat_at_table
//        └ serving
//            ├ take_order
//            ├ serve_order
//            └ take_payment
//
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    pub mod serving {
        fn take_order() {}

        pub fn serve_order() {}

        fn take_payment() {}
    }
}

fn serve_order() {}

mod back_of_house {
    // If we make a struct definition public, that doesn't make its fields public.
    // We have to manually make each field public.
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    // But if we make an enum public, then all of its variants are public.
    pub enum Appetizer {
        Soup,
        Salad,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }

    fn fix_incorrect_order() {
        cook_order();

        // super is similar to how `..` works in filesystem paths.
        super::serve_order();

        // targeting the serve_order function in crate::front_of_house::serving::serve_order.
        super::front_of_house::serving::serve_order();
    }

    fn cook_order() {}
}

// Absolute and relative paths can get lengthy.
// We can bring paths into scope with the `use` keyword.
// It's analagous to symlinks in filesystems.
use crate::front_of_house::hosting;

// We can also do this, but the above is more idiomatic -- bringing in the parent module because it
// tells us some information about where something came from.
//
// HOWEVER, it's idiomatic to specify the full path if we're bringing in structs, enums, and other
// items. The book says that there's no strong reason. It just manifested from how people have done
// it.
use crate::front_of_house::hosting::add_to_waitlist;

// We can bring things in under new names with the `as` keyword.
use crate::front_of_house::hosting::add_to_waitlist as add_to_the_freaking_waitlist;

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();

    // ahhh, much shorter
    hosting::add_to_waitlist();

    // even shorter, but not idiomatic
    add_to_waitlist();

    // aliased name
    add_to_the_freaking_waitlist();

    let mut meal = back_of_house::Breakfast::summer("Rye");

    // We can read this field because it's public.
    meal.toast = String::from("wheat");
    println!("I'd like {} toast please", meal.toast);

    // The variants of the enum are public.
    let _order1 = back_of_house::Appetizer::Soup;
    let _order2 = back_of_house::Appetizer::Salad;
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
