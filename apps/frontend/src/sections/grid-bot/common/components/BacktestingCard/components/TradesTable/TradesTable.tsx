import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { TradesTableHead } from "./TradesTableHead";
import { TradesTableItem } from "./TradesTableItem";

const componentName = "TradesTable";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type TradesTableProps = {
  className?: string;
  transactions: Array<any>; // @todo type from tRPC
  baseCurrency: string;
  quoteCurrency: string;
};

export const TradesTable: FC<TradesTableProps> = (props) => {
  const { className, transactions, baseCurrency, quoteCurrency } = props;

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small">
        <TradesTableHead
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
        />

        {transactions.length > 0 ? (
          <TableBody>
            {transactions.map((transaction, i) => (
              <TradesTableItem transaction={transaction} key={i} />
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" colSpan={6}>
                <Typography
                  textAlign="center"
                  sx={{
                    pt: 2,
                    pb: 2,
                  }}
                >
                  Backtesting in progress...
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
