import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prismaService.feature.findMany({});
  }

  async update(id: string, updateFeatureDto: UpdateFeatureDto) {
    try {
      await this.prismaService.feature.findFirstOrThrow({
        where: { id },
      });
      return this.prismaService.feature.update({
        data: updateFeatureDto,
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} feature`;
  }
}
