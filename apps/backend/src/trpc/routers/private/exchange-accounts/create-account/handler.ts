import { xprisma } from 'src/trpc/prisma';
import { Context } from 'src/trpc/utils/context';
import { TCreateExchangeAccountInputSchema } from './schema';

type Options = {
  ctx: {
    user: NonNullable<Context['user']>;
  };
  input: TCreateExchangeAccountInputSchema;
};

export async function createExchangeAccount({ input, ctx }: Options) {
  const exchangeAccount = await xprisma.exchangeAccount.create({
    data: {
      ...input,
      owner: {
        connect: {
          id: ctx.user.id,
        },
      },
    },
  });

  return exchangeAccount;
}
