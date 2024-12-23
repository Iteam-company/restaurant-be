import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/multer/storage';
import { IconInterceptor } from 'src/user/icon/icon.interceptor';

const UseIconInterceptor = () =>
  UseInterceptors(
    FileInterceptor('file', { storage: storage }),
    IconInterceptor,
  );

export default UseIconInterceptor;
