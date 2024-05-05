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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomQuery } from './dto/query';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current.user';
import { User } from '@prisma/client';
export interface IParamQuery {
  sort?: string;
  pageSize?: string;
  pageNumber?: string;
  sortBy?: string;
  totalBooking?: 'true' | 'false';
  status?: 'checked-in' | 'checked-out' | 'unconfirmed';
}
@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    console.log(createRoomDto);
    return this.roomService.create(createRoomDto);
  }
  @Get('count')
  count() {
    return this.roomService.count();
  }
  @Get()
  findAll(@Query() query: RoomQuery) {
    return this.roomService.findAll(query);
  }
  @Get('/preview')
  findAllPreview() {
    return this.roomService.findAllPreview();
  }
  @Get('/unavailable-dates/:id')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: Omit<User, 'password'>,
  ) {
    console.log('user', user);
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
