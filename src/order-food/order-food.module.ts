import { Module } from '@nestjs/common';
import { OrderFoodService } from './order-food.service';
import { OrderFoodController } from './order-food.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderFoodController],
  providers: [OrderFoodService],
})
export class OrderFoodModule {}
