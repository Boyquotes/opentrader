import { GridBotProcessor } from "@opentrader/processing";
import { GridBotService } from "#trpc/services/grid-bot.service";
import type { Context } from "#trpc/utils/context";
import type { TStartGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TStartGridBotInputSchema;
};

export async function startGridBot({ input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);
  botService.assertIsNotAlreadyRunning();
  botService.assertIsNotProcessing();

  const botProcessor = new GridBotProcessor(botService.bot);
  await botProcessor.processStartCommand();

  await botService.start();

  await botProcessor.placePendingOrders();

  return {
    ok: true,
  };
}
