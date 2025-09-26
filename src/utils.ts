export function formatCurrency1(n: number) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2)
}

export function formatCurrency2(n: number) {
    return '$ ' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatPercent(n: number) {
    return (n * 100).toFixed(1) + '%'
}

export function expensiveRollup(numbers: number[]) {
    let s = 0
    for (let i = 0; i < 5_000_000; i++) {
        s += (numbers[i % numbers.length] || 0) * Math.random()
    }
    return s
}