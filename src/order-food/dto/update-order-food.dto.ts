import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderFoodDto } from './create-order-food.dto';

export class UpdateOrderFoodDto extends PartialType(CreateOrderFoodDto) {}
