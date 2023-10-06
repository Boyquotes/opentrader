import { exchanges, IExchange } from '@opentrader/exchanges';
import { ExchangeCode, IWatchOrder } from '@opentrader/types';
import { Logger } from '@nestjs/common';
import {
  ExchangeAccountWithCredentials,
  OrderWithSmartTrade,
} from '@opentrader/db';

type Event = 'onFilled' | 'onCanceled';

type Subscription = {
  event: Event;
  callback: (exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) => void;
};

export abstract class OrderSynchronizerWatcher {
  protected abstract logger: Logger;

  private consumers: Subscription[] = [];
  protected enabled: boolean = false;

  protected exchange: ExchangeAccountWithCredentials;
  protected exchangeService: IExchange;

  constructor(exchange: ExchangeAccountWithCredentials) {
    this.exchange = exchange;

    const credentials = {
      ...exchange.credentials,
      code: exchange.credentials.code as ExchangeCode, // workaround for casting string literal into `ExchangeCode`
      password: exchange.password || '',
    };
    this.exchangeService = exchanges[exchange.exchangeCode](credentials);
  }

  async enable() {
    this.logger.debug(
      `Created watcher for ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );

    this.enabled = true;
    this.watchOrders(); // await was omitted intentionally
  }

  async disable() {
    this.enabled = false;

    this.logger.debug(
      `Destroyed watcher of ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );
  }

  protected abstract watchOrders(): void;

  /**
   * Subscribe to or filled / canceled events.
   */
  subscribe(event: Event, callback: Subscription['callback']) {
    this.consumers.push({
      event,
      callback,
    });
  }

  unsubscribe(event: Event, callback: Subscription['callback']) {
    // remove consumer from array
    this.consumers = this.consumers.filter(
      (consumer) => consumer.callback !== callback,
    );
  }

  unsubscribeAll() {
    this.consumers = [];
  }

  emit(event: Event, args: Parameters<Subscription['callback']>) {
    const consumers = this.consumers.filter(
      (consumer) => consumer.event === event,
    );

    for (const consumer of consumers) {
      consumer.callback(...args);
    }
  }
}
