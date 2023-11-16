import NextLink from "next/link";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import React from "react";
import { BotCard } from "src/components/grid-bot/bots-list/BotCard";
import { tServer } from "src/lib/trpc/server";

export default async function Page() {
  const bots = await tServer.gridBot.list();

  return (
    <Grid container spacing={4}>
      <Grid xs={12}>
        <Button
          size="lg"
          component={NextLink}
          href="/dashboard/grid-bot/create"
        >
          Create new bot
        </Button>
      </Grid>

      <Grid xl={4} md={5} xs={12}>
        {bots.map((bot, i) => (
          <BotCard
            key={bot.id}
            bot={bot}
            sx={{ marginTop: i !== 0 ? "32px" : undefined }}
          />
        ))}
      </Grid>
    </Grid>
  );
}