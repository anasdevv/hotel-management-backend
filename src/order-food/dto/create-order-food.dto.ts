// id         String    @id @default(uuid())
// quantity   Int
// // item
// order      Order?    @relation(fields: [orderId], references: [id])
// orderId    String?
// foodItem   FoodItem? @relation(fields: [foodItemId], references: [id])

import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// foodItemId String?
export class CreateOrderItemDto {
  @IsNotEmpty()
  id: string;
  @IsPositive()
  @Min(1)
  quantity: number;
}
export class CreateOrderFoodDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orders: CreateOrderItemDto[];
}
