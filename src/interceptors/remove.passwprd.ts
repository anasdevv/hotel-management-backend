import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (Array.isArray(value))
          return value.map((v) => ({
            ...v,
            password: undefined,
          }));
        value.password = undefined;
        return value;
      }),
    );
  }
}
