import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsInt()
  maxCapacity: number;

  @IsInt()
  regularPrice: number;

  @IsInt()
  discount: number;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsString()
  roomImage: string;

  @IsOptional()
  @IsArray()
  //   @ValidateNested({ each: true })
  @Transform(({ value }) => value.map((val) => Number(val)))
  features?: number[];
}
