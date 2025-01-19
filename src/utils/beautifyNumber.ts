export default function beautifyNumber(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)} K`
  } else if (n >= 10000) {
    return `${(n / 1000).toFixed(0)} K`
  } else if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)} M`
  } else if (n >= 10000000) {
    return `${(n / 1000000).toFixed(0)} M`
  } else if (n >= 1000000000) {
    return `${(n / 1000000000).toFixed(1)} B`
  } else if (n >= 10000000000) {
    return `${(n / 1000000000).toFixed(0)} B`
  } else {
    return `${n}`
  }
}