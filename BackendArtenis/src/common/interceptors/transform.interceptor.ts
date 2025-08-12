import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        // Si la respuesta ya tiene estructura definida, la devolvemos tal como está
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Si es una respuesta con estructura de mensaje y data
        if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
          return {
            success: true,
            message: data.message,
            data: data.data,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        // Respuesta estándar para otros casos
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
