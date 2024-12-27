import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/multer/storage';
import { CsvInterceptor } from 'src/user/csv/csv.interceptor';

const UseCsvInterceptor = () =>
  UseInterceptors(
    FileInterceptor('file', { storage: storage }),
    CsvInterceptor,
  );

export default UseCsvInterceptor;
