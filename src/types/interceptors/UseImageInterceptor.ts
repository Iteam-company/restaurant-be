import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/multer/storage';
import { ImageInterceptor } from 'src/restaurant/image/image.interceptor';

const UseImageInterceptor = () =>
  UseInterceptors(
    FileInterceptor('file', { storage: storage }),
    ImageInterceptor,
  );

export default UseImageInterceptor;
