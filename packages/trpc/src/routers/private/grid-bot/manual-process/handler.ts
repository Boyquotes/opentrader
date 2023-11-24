import { GridBotProcessor } from "@opentrader/processing";
import { GridBotService } from "#trpc/services/grid-bot.service";
import type { Context } from "#trpc/utils/context";
import type { TManualProcessGridBotInputSchema } from "./schema";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
  input: TManualProcessGridBotInputSchema;
};

export async function manualProcessGridBot({ input }: Options) {
  const { botId } = input;

  const botService = await GridBotService.fromId(botId);
  botService.assertIsRunning();
  botService.assertIsNotProcessing();

  const botProcessor = new GridBotProcessor(botService.bot);
  await botProcessor.process();

  return {
    ok: true,
  };
}
