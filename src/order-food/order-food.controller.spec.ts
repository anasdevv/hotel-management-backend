import { Test, TestingModule } from '@nestjs/testing';
import { OrderFoodController } from './order-food.controller';
import { OrderFoodService } from './order-food.service';

describe('OrderFoodController', () => {
  let controller: OrderFoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderFoodController],
      providers: [OrderFoodService],
    }).compile();

    controller = module.get<OrderFoodController>(OrderFoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
