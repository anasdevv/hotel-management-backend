import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  name: string;
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  password: string;

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: 'Please provide only digits without any special characters.',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
