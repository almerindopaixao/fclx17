import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item-dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  card_hash: string;
}
