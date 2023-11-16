import { Dictionary, Exchange, Market } from "ccxt";
import { ExchangeCode } from "@opentrader/types";
import { Prisma, xprisma } from "@opentrader/db";
import { ICacheProvider } from "#exchanges/types/cache/cache-provider.interface";

export class PrismaCacheProvider implements ICacheProvider {
  async getMarkets(exchangeCode: ExchangeCode, ccxtExchange: Exchange) {
    const startTime = Date.now();

    const cachedMarkets = await xprisma.markets.findUnique({
      where: {
        exchangeCode,
      },
    });

    if (cachedMarkets) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log("🏛️ @opentrader/exchanges");
      console.log(
        `    getMarkets() from ${exchangeCode} exchange using PrismaCacheProvider`,
      );
      console.log(`    Returned from cache in ${duration}s`);
      return cachedMarkets.markets as any as Dictionary<Market>; // @todo better types
    }

    // If not cached, loadMarkets and cache to DB
    const markets = await ccxtExchange.loadMarkets();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log("🏛️ @opentrader/exchanges");
    console.log(
      `    getMarkets() from ${exchangeCode} exchange using PrismaCacheProvider`,
    );
    console.log(`    Fetched from Exchange in ${duration}s`);

    return this.cacheMarkets(markets, exchangeCode);
  }

  private async cacheMarkets(
    markets: Dictionary<Market>,
    exchangeCode: ExchangeCode,
  ) {
    await xprisma.markets.create({
      data: {
        exchangeCode,
        markets: markets as any as Prisma.InputJsonValue, // @todo better types
      },
    });
    return markets;
  }
}