import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/decorators/current.user';
import { User } from '@prisma/client';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(user.id, createReviewDto);
  }

  @Get('/user/:id')
  findAllByUser(@Param('id') id: string) {
    return this.reviewService.findAll(id, 'user');
  }
  @Get('/room/:id')
  findAllOnRoom(@Param('id') id: string) {
    return this.reviewService.findAll(id, 'room');
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
