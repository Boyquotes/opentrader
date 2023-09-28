import { ExchangeCode } from "@bifrost/types";
import { CURRENCY_PAIR_DELIMITER, EXCHANGE_CODE_DELIMITER } from "./constants";

export function isValidSymbolId(symbolId: string) {
  const exchangeCodes = Object.keys(ExchangeCode);
  const symbolPattern =
    `^(${exchangeCodes.join("|")})` +
    EXCHANGE_CODE_DELIMITER +
    `[A-Z]+` +
    CURRENCY_PAIR_DELIMITER +
    `[A-Z]+$`;

  return new RegExp(symbolPattern).test(symbolId);
}
