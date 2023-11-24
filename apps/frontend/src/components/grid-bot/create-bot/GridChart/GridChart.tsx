"use client";

import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Skeleton from "@mui/joy/Skeleton";
import type { IGridLine } from "@opentrader/types";
import type { FC } from "react";
import React, { Suspense, useDeferredValue, useMemo, useState } from "react";
import { Chart, ChartAppBar } from "src/ui/charts/Chart";
import { CHART_HEIGHT } from "src/ui/charts/Chart/constants";
import { ExchangeAccountField } from "src/components/grid-bot/create-bot/form/fields/ExchangeAccountField";
import { PairField } from "src/components/grid-bot/create-bot/form/fields/PairField";
import { FlexSpacer } from "src/ui/FlexSpacer";
import { BarSizeSelect } from "src/ui/selects/BarSizeSelect";
import { InputSkeleton } from "src/ui/InputSkeleton";
import type { TBarSize } from "src/types/literals";
import { computePriceLines } from "./utils";

const timeframes = ["1d", "4h", "1h", "5m"] as const;
export type ChartBarSize = Extract<TBarSize, (typeof timeframes)[number]>;

type GridChartProps = {
  symbolId: string;
  barSize: ChartBarSize;
  onBarSizeChange?: (value: ChartBarSize) => void;
  gridLines: IGridLine[];
  currentAssetPrice: number;
};

export const GridChart: FC<GridChartProps> = ({
  symbolId,
  barSize,
  onBarSizeChange,
  gridLines,
  currentAssetPrice,
}) => {
  const deferredSymbolId = useDeferredValue(symbolId);
  const isStale = symbolId !== deferredSymbolId;

  const priceLines = useMemo(
    () => computePriceLines(gridLines, currentAssetPrice),
    [gridLines, currentAssetPrice],
  );
  const [showPriceLines, setShowPriceLines] = useState(true);

  return (
    <Suspense
      fallback={
        <Skeleton
          animation="wave"
          height={CHART_HEIGHT}
          variant="rectangular"
          width="100%"
        />
      }
    >
      <Chart
        barSize={barSize}
        dimmed={isStale}
        priceLines={priceLines}
        showPriceLines={showPriceLines}
        symbolId={deferredSymbolId}
      >
        <ChartAppBar>
          <Suspense fallback={<InputSkeleton width={232} />}>
            <ExchangeAccountField />
          </Suspense>

          <Suspense fallback={<InputSkeleton width={232} />}>
            <PairField />
          </Suspense>

          <BarSizeSelect
            onChange={(value) => {
              if (onBarSizeChange) {
                onBarSizeChange(value);
              }
            }}
            value={barSize}
            whitelist={timeframes}
          />

          <FlexSpacer />

          <Box display="flex">
            <Checkbox
              checked={showPriceLines}
              label="Grid"
              onChange={(e) => setShowPriceLines(e.target.checked)}
              size="md"
            />
          </Box>
        </ChartAppBar>
      </Chart>
    </Suspense>
  );
};
