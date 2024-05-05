import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { FoodItemQuery } from './dto/FoodItem.query';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
@UseGuards(JwtAuthGuard)
@Controller('food-items')
export class FoodItemController {
  constructor(private readonly foodItemService: FoodItemService) {}

  @Post()
  create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemService.create(createFoodItemDto);
  }

  @Get()
  findAll(@Query() query: FoodItemQuery) {
    return this.foodItemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFoodItemDto: UpdateFoodItemDto,
  ) {
    return this.foodItemService.update(id, updateFoodItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodItemService.remove(id);
  }
}
