import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { xprisma } from '../prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateExpressContextOptions) {
  const user = await xprisma.user.findUnique({
    where: {
      id: 1,
    },
  });

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
