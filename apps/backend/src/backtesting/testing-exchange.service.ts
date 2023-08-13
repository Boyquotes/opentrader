import { IExchange } from '@bifrost/exchanges';
import {
  IAccountAsset,
  IGetTradingFeeRatesRequest,
  IGetTradingFeeRatesResponse,
  ITradingPairSymbolRequest,
  IGetCandlesticksRequest,
  ICandlestick,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  IGetSymbolInfoRequest,
  ISymbolInfo,
  ExchangeCode,
} from '@bifrost/types';

export class TestingExchangeService implements IExchange {
  ccxt = {} as any;

  // Testing-specific properties
  private assetPrice: number;
  public setCurrentAssetPrice(price: number) {
    this.assetPrice = price;
  }

  async loadMarkets() {
    return {};
  }

  async accountAssets(): Promise<IAccountAsset[]> {
    return [];
  }

  async getLimitOrder(
    body: IGetLimitOrderRequest,
  ): Promise<IGetLimitOrderResponse> {
    return {
      exchangeOrderId: '',
      clientOrderId: '',
      price: 0,
      quantity: 1,
      side: 'buy',
      status: 'filled',
      fee: 0,
      createdAt: 0,
    };
  }

  async placeLimitOrder(
    body: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse> {
    return {
      orderId: '',
      clientOrderId: '',
    };
  }

  async cancelLimitOrder(
    body: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse> {
    return {
      orderId: '',
    };
  }

  async getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse> {
    const { symbol } = params;

    return {
      symbol,
      price: this.assetPrice,
      timestamp: 0,
    };
  }

  async getCandlesticks(
    params: IGetCandlesticksRequest,
  ): Promise<ICandlestick[]> {
    return [];
  }

  async getTradingFeeRates(
    params: IGetTradingFeeRatesRequest,
  ): Promise<IGetTradingFeeRatesResponse> {
    return {
      makerFee: 0,
      takerFee: 0,
    };
  }

  async getSymbol(params: IGetSymbolInfoRequest): Promise<ISymbolInfo> {
    return {
      symbolId: 'ADA/USDT',
      exchangeCode: ExchangeCode.OKX,
      exchangeSymbolId: 'ADA-USDT',
      baseCurrency: 'ADA',
      quoteCurrency: 'USDT',
      filters: {
        price: {
          minPrice: '0.0001',
          tickSize: '0.0001',
          maxPrice: '100000',
        },
        lot: {
          minQuantity: '1',
          stepSize: '1',
          maxQuantity: '10000',
        },
      },
    };
  }

  async getSymbols(): Promise<ISymbolInfo[]> {
    return [];
  }

  tradingPairSymbol(params: ITradingPairSymbolRequest) {
    return `${params.baseCurrency}-${params.quoteCurrency}`;
  }
}
