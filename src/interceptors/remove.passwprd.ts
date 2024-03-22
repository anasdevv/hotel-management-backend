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
          return value.map((v) =>
            typeof v === 'object' && v.password
              ? {
                  ...v,
                  password: undefined,
                }
              : v,
          );
        if (typeof value === 'object' && value.password)
          value.password = undefined;
        return value;
      }),
    );
  }
}
