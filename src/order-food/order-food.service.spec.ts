import { Test, TestingModule } from '@nestjs/testing';
import { OrderFoodService } from './order-food.service';

describe('OrderFoodService', () => {
  let service: OrderFoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderFoodService],
    }).compile();

    service = module.get<OrderFoodService>(OrderFoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
