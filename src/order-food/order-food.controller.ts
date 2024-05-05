import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderFoodService } from './order-food.service';
import { CreateOrderFoodDto } from './dto/create-order-food.dto';
import { UpdateOrderFoodDto } from './dto/update-order-food.dto';
import { CurrentUser } from 'src/decorators/current.user';
import { User } from '@prisma/client';

@Controller('order-food')
export class OrderFoodController {
  constructor(private readonly orderFoodService: OrderFoodService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createOrderFoodDto: CreateOrderFoodDto,
  ) {
    return this.orderFoodService.create(user.id, createOrderFoodDto);
  }

  @Get()
  findAll() {
    return this.orderFoodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderFoodService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderFoodDto: UpdateOrderFoodDto,
  ) {
    return this.orderFoodService.update(id, updateOrderFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderFoodService.remove(id);
  }
}
