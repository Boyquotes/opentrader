import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  Scope,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { parseISO } from 'date-fns';
import { RunGridBotBackTestDto } from 'src/backtesting/dto/grid-bot/run-grid-bot-back-test.dto';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { symbolId } from 'src/core/db/postgres/utils/candlesticks-history/symbolId';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { ICandlestick } from '@bifrost/types';
import { useGridBot } from 'src/grid-bot/use-grid-bot';
import { DataSource } from 'typeorm';
import { BacktestingService } from './backtesting.service';
import { ITrade } from './types/trade.interface';
import { convertSmartTradesToTrades } from './utils/convertSmartTradesToTrades';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';

@Controller({
  path: 'backtesting',
  scope: Scope.REQUEST,
})
@ApiTags('Backtesting')
export class BacktestingController {
  constructor(
    private readonly backtestingService: BacktestingService,
    private readonly firestoreService: FirestoreService,
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
    private readonly dataSource: DataSource,
    private readonly candlesticksRepo: CandlesticksRepository,
  ) {}

  @Post('/grid-bot/test')
  async test(
    @FirebaseUser() user: IUser,
    @Body() body: RunGridBotBackTestDto,
  ): Promise<{
    candles: ICandlestick[];
    trades: ITrade[];
    finishedSmartTradesCount: number;
    totalProfit: number;
    smartTrades: ISmartTrade[];
  }> {
    const bot = await this.firestoreService.gridBot.findOne(body.botId);

    const symbol = symbolId(bot.baseCurrency, bot.quoteCurrency);

    const fromTimestamp = parseISO(body.startDate).getTime();
    const toTimestamp = parseISO(body.endDate).getTime();

    const candlesticks = await this.candlesticksRepo.findAndSort(
      symbol,
      fromTimestamp,
      toTimestamp,
    );

    if (candlesticks.length === 0) {
      throw new NotFoundException(
        `Not found candlesticks history data for ${symbol} symbol`,
      );
    }

    const backtesting = new BacktestingService();

    const { smartTrades, finishedSmartTradesCount, totalProfit } =
      await backtesting.run(bot, useGridBot, candlesticks);

    const trades = convertSmartTradesToTrades(smartTrades);

    return {
      trades,
      candles: candlesticks,
      finishedSmartTradesCount,
      totalProfit,
      smartTrades,
    };
  }
}
