import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeatureService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createFeatureDto: CreateFeatureDto) {
    return this.prismaService.feature.create({
      data: createFeatureDto,
    });
  }

  findAll() {
    return `This action returns all feature`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feature`;
  }

  update(id: number, updateFeatureDto: UpdateFeatureDto) {
    return `This action updates a #${id} feature`;
  }

  remove(id: number) {
    return `This action removes a #${id} feature`;
  }
}
