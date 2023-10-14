const DEFAULT_PRECISION = 2;
export function roundFloat(num: number, precision = DEFAULT_PRECISION) {
  return parseFloat(num.toFixed(precision));
}
