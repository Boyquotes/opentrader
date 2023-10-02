import { ApiProperty } from '@nestjs/swagger';
import { OrderSideEnum, OrderStatusEnum } from '@opentrader/types';
import {
  BaseSmartOrder,
  SmartBuyOrder,
  SmartBuyOrderFilled,
  SmartBuyOrderIdle,
  SmartBuyOrderPlaced,
} from '../types';
import { SmartBuyOrderFilledEntity } from './buy-order-filled.entity';
import { SmartBuyOrderIdleEntity } from './buy-order-idle.entity';
import { SmartBuyOrderPlacedEntity } from './buy-order-placed.entity';

export class SmartBuyOrderEntity<T = SmartBuyOrder>
  implements BaseSmartOrder<OrderSideEnum.Buy, OrderStatusEnum>
{
  exchangeOrderId: string;

  clientOrderId: string;

  @ApiProperty({
    enum: OrderSideEnum,
  })
  side: OrderSideEnum.Buy;

  quantity: number;

  price: number;

  @ApiProperty({
    enum: OrderStatusEnum,
  })
  status: OrderStatusEnum;

  fee: number;

  createdAt: number;
  updatedAt: number;

  constructor(smartBuyOrder: SmartBuyOrderEntity) {
    Object.assign(this, smartBuyOrder);
  }

  static from(order: SmartBuyOrder) {
    switch (order.status) {
      case OrderStatusEnum.Idle:
        return new SmartBuyOrderIdleEntity(order);
      case OrderStatusEnum.Placed:
        return new SmartBuyOrderPlacedEntity(order);
      case OrderStatusEnum.Filled:
        return new SmartBuyOrderFilledEntity(order);
    }
  }

  static buyIdle(order: SmartBuyOrderIdle): SmartBuyOrderIdleEntity {
    return new SmartBuyOrderIdleEntity(order);
  }

  static buyPlaced(order: SmartBuyOrderPlaced): SmartBuyOrderPlacedEntity {
    return new SmartBuyOrderPlacedEntity(order);
  }

  static buyFilled(order: SmartBuyOrderFilled): SmartBuyOrderFilledEntity {
    return new SmartBuyOrderFilledEntity(order);
  }
}
