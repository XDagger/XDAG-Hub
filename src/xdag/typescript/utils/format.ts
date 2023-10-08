

const ELLIPSIS = "\u{2026}";
export function formatAddress(address: string) {
  if (address.length <= 6) {
    return address;
  }
  return `${address.slice(0, 0 + 9)}${ELLIPSIS}${address.slice( -9, )}`;
}
