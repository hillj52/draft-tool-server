import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const Serialize = <DTO = any>(dto: ClassConstructor<DTO>) =>
  UseInterceptors(new SerializerInterceptor(dto));

export class SerializerInterceptor<DTO> implements NestInterceptor<any, DTO> {
  constructor(private dto: ClassConstructor<DTO>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<DTO> {
    return next.handle().pipe(
      map(
        (data) =>
          plainToInstance<DTO, DTO>(this.dto, data, {
            excludeExtraneousValues: true,
          }) as unknown as DTO,
      ),
    );
  }
}
