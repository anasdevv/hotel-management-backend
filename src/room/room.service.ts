import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  create({ features, ...room }: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        ...room,
        features: {
          connect: features.map((featureId) => ({ id: featureId })),
        },
      },
    });
  }

  // todo select relevant fields only
  findAll() {
    return this.prisma.room.findMany({
      include: {
        features: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
