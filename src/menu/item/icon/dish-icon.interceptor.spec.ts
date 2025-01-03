import { CallHandler, ExecutionContext } from '@nestjs/common';
import { DishIconInterceptor } from './dish-icon.interceptor';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import { join } from 'path';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

describe('IconInterceptor', () => {
  let iconInterceptor: DishIconInterceptor;
  let context: Partial<ExecutionContext>;
  let next: Partial<CallHandler>;

  beforeAll(async () => {
    await cloudinary.config({
      cloud_name: await new ConfigService().get('CLOUDINARY_CLOUD_NAME'),
      api_key: await new ConfigService().get('CLOUDINARY_API_KEY'),
      api_secret: await new ConfigService().get('CLOUDINARY_API_SECRET'),
    });

    iconInterceptor = new DishIconInterceptor();

    const filename = 'testIcon2.svg';

    const filePath = join(__dirname, '../../../', 'test.svg');
    const fileContent = await fs.readFile(filePath);

    await fs.writeFile(
      join(__dirname, '../../../../uploads', filename),
      fileContent,
    );

    const file = {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype: 'image/svg',
      filename: filename,
      destination: 'uploads',
      path: 'uploads/' + filename,
      size: fileContent.length,
      buffer: fileContent,
    };

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          file: file,
          imageUrl: undefined,
        }),
      }),
    };
    next = {
      handle: jest.fn(),
    };
  });

  it('should be defined', async () => {
    expect(iconInterceptor).toBeDefined();
  });

  it('should upload file and return url', async () => {
    await iconInterceptor.intercept(
      context as ExecutionContext,
      next as CallHandler,
    );

    const url = context.switchToHttp().getRequest().imageUrl;

    expect(url).toBeDefined();

    await removeCloudinaryImage(url);
  });

  it('should handle when no file uploaded', async () => {
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          file: null,
          imageUrl: undefined,
        }),
      }),
    };

    await iconInterceptor.intercept(
      context as ExecutionContext,
      next as CallHandler,
    );

    expect(context.switchToHttp().getRequest().imageUrl).not.toBeDefined();
  });
});

async function removeCloudinaryImage(image: string) {
  const url = image.split('/');
  await cloudinary.api.delete_resources([
    join('dishes', url[url.length - 1].split('.')[0]),
  ]);
}
