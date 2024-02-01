import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class OrderItemDto {
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
