import type { OrderWithSmartTrade } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import { cargoQueue } from "async";

export const processingQueue = cargoQueue<OrderWithSmartTrade["id"]>(
  async (tasks, callback) => {
    if (tasks.length > 1) {
      console.log(`📠 Batching ${tasks.length} tasks`);
    } else {
      console.log(`📠 Processing ${tasks.length} task`);
    }

    // getting last task from the queue
    const smartTradeId = tasks[tasks.length - 1];

    const bot = await BotProcessing.fromSmartTradeId(smartTradeId);

    await bot.process();
    await bot.placePendingOrders();

    callback();
  },
);
