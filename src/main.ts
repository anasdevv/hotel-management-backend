import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    cors: true,
  });
  app.use(cookieParser());
  app.use(morgan('tiny'));

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => {
            console.log('const ', error.constraints);
            console.log('prop ', error.property);

            return {
              field: error.property,
              error: Object.values(error.constraints).join(', '),
            };
          }),
        );
      },
    }),
  );
  await app.listen(configService.get('APP_PORT') || 3002);
}
bootstrap();
