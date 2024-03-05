import { Exclude, Transform, TransformFnParams } from 'class-transformer';
import { IsAlphanumeric, IsEmail, IsString, Length } from 'class-validator';
import { IsNotBlank } from 'src/decorators/not.empty.blank';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6)
  //   @Exclude()
  password: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(4)
  @IsString()
  firstName: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(4)
  @IsString()
  lastName: string;
}
