import { ExchangeAccountDto } from 'src/core/db/firestore/repositories/exchange-account/dto/exchange-account.dto';

export class GetExchangeAccountsResponseBodyDto {
  exchangeAccounts: ExchangeAccountDto[];
}