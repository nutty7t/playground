function sum (n) {
    let count = 0
    let total = 0

    do {
        count = count + 1
        total = total + count
    } while (count !== n)

    return total
}

console.log(sum(5))
