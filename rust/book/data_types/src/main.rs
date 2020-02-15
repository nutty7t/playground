fn main() {
    // There are two types of types: scalar and compound.
    //
    // *Scalar* types represent a single value (i.e. integers, floating-point numbers, booleans,
    // characters).
    //
    // *Compound* types can group multiple values into one type. Rust has two primitive compound
    // types: tuples and arrays.
    //
    // Integer types
    //    Signed: i8, i16, i32 (default), i64, i128, isize (stored internally as two's complement)
    //    Unsigned: u8, u16, u32, u64, u128, usize
    //
    // isize and usize are dependent on the computer architecture: typically either 32-bits or
    // 64-bits.
    //
    // Integer literals are similar to literals in other languages.
    //
    // Number Literals | Example
    // ----------------+---------------
    // Decimal         | 98_222
    // Hex             | 0xff
    // Octal           | 0o77
    // Binary          | 0b1111_0000
    // Byte (u8 only)  | b'A'
    //
    // Interesting. In debug mode, if Rust can deduce that an operation will overflow, it will
    // cause the program to panic (exit with an error) at runtime. If you want o wrap explicitly,
    // you can use the standard library type `Wrapping`.
    let _foo: i32 = 7;
    let _bar: u32 = 7;

    // strongly-typed, this is disallowed
    // let baz = _foo + _bar

    // Floating-point number types
    //    f32 and f64 (default)
    //    standard IEEE-754

    // Characters
    //    - four bytes in size (represents a Unicode Scalar Value; a codepoint)

    // Tuples
    //    - fixed length
    //    - elements may have different types
    //    - supports destructuring!
    let tup: (i32, f64, u8) = (500, 6.4, b'A');
    let (_x, y, _z) = tup;
    println!("The value of the second element is {}", y);
    println!("The value of the third element is {}", tup.2);

    // Arrays
    //    - also must have fixed length
    //    - elements must have same type
    //    - allocates on the stack
    //
    // If you want a collection that can grow or shrink in size, consider the vector.
    //    - allocates on the heap (I think)
    //    - variable length
    let arr: [bool; 5] = [true, false, true, true, false];
    println!("The value of the first element is {}", arr[0]);

    // Rust programs will panic if there is an attempt to access invalid memory.
    let index = 6;
    println!("The value of the first element is {}", arr[index]);
}
