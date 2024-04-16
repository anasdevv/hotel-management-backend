import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { FoodItemModule } from './food-item/food-item.module';
import { FeatureModule } from './feature/feature.module';
import { OrderFoodModule } from './order-food/order-food.module';
import { ReviewModule } from './review/review.module';
import * as Joi from 'joi';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    AdminModule,
    RoomModule,
    BookingModule,
    FoodItemModule,
    FeatureModule,
    OrderFoodModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
