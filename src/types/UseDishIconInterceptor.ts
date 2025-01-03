import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DishIconInterceptor } from 'src/menu/item/icon/dish-icon.interceptor';
import { storage } from 'src/multer/storage';

const UseDishIconInterceptor = () =>
  UseInterceptors(
    FileInterceptor('file', { storage: storage }),
    DishIconInterceptor,
  );

export default UseDishIconInterceptor;
