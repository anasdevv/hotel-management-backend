import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
@UseGuards(JwtAuthGuard)
@Controller('features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featureService.create(createFeatureDto);
  }

  @Get()
  async findAll() {
    const f = await this.featureService.findAll();
    console.log('f', f);
    return f;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featureService.update(id, updateFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureService.remove(+id);
  }
}
