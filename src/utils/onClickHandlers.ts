export default function noPropagate(f?: () => void): (e: React.MouseEvent<HTMLElement>) => void {
  return (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (f) {
      f();
    }
  }
}