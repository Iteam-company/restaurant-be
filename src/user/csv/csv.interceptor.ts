import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class CsvInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    if (!req.file) throw new BadRequestException('No file uploaded');

    const filePath = req.file.path;
    const fileData = await fs.readFile(filePath, 'utf8');

    req.fileData = fileData;

    return next.handle();
  }
}
