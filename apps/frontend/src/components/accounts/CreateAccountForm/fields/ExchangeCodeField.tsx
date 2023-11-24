import { ExchangeCode } from "@opentrader/types";
import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Field } from "react-final-form";
import type { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "exchangeCode";

export function ExchangeCodeField() {
  return (
    <Field<ExchangeCode> name={fieldName}>
      {({ input }) => (
        <Select
          defaultValue={ExchangeCode.OKX}
          name={input.name}
          onChange={input.onChange}
          required
          value={input.value}
        >
          <Option value={ExchangeCode.OKX}>OKx</Option>
        </Select>
      )}
    </Field>
  );
}
