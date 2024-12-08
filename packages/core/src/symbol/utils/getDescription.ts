const SYMBOL_INDEX_START = 7;
const SYMBOL_INDEX_END = -1;

export function getDescription(symbol: symbol) {
  return symbol.toString().slice(SYMBOL_INDEX_START, SYMBOL_INDEX_END);
}
