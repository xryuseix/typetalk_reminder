export function pad(num: number, len: number) {
  return (Array(len).join("0") + num).slice(-len);
}
