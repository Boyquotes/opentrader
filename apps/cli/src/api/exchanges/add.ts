import { ExchangeCode } from "@opentrader/types";
import type { CommandResult } from "../../types.js";
import { createClient } from "../../daemon.js";

type Options = {
  config: string;
  /**
   * Exchange name.
   */
  name: string | null;
  /**
   * Exchange label.
   */
  label: string;
  code: ExchangeCode;
  key: string;
  secret: string;
  password: string | null;
  /**
   * Is demo account?
   */
  demo: boolean;
};

const daemon = createClient();

export async function addExchangeAccount(
  options: Options,
): Promise<CommandResult> {
  await daemon.exchangeAccount.create.mutate({
    name: options.name || options.label,
    label: options.label,
    exchangeCode: options.code,
    apiKey: options.key,
    secretKey: options.secret,
    password: options.password,
    isDemoAccount: options.demo,
  });

  return {
    result: "Exchange account added successfully.",
  };
}