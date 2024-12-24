import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ImageInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (!req.file) return next.handle();

    const filename = join('uploads', req.file.filename);
    try {
      req.imageUrl = (
        await cloudinary.uploader.upload(filename, {
          folder: 'restaurants',
        })
      ).url;

      fs.unlink(filename);
    } catch (error) {
      throw error;
    }

    return next.handle();
  }
}
