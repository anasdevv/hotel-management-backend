import {
  IsString,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class CreateFoodItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  picture: string;
}
