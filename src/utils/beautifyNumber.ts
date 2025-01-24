/**
 * beautifyNumber takes in a number n and returns a string representation
 * of the number in the abbreviated K, M, B expectedly if it is greater than or equal
 * to 1_000, 1_000_000 and 1_000_000_000 respectively. Note that the rounding off is to
 * 1 decimal point if 1_000 <= n < 10_0000, 1_000_000 <= n 10_0000_000 < n,
 *  and 1_000_000_000 <= n < 10_000_000_000
 */
export default function beautifyNumber(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)} K`;
  } else if (n >= 10000) {
    return `${(n / 1000).toFixed(0)} K`;
  } else if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)} M`;
  } else if (n >= 10000000) {
    return `${(n / 1000000).toFixed(0)} M`;
  } else if (n >= 1000000000) {
    return `${(n / 1000000000).toFixed(1)} B`;
  } else if (n >= 10000000000) {
    return `${(n / 1000000000).toFixed(0)} B`;
  } else {
    return `${n}`;
  }
}
