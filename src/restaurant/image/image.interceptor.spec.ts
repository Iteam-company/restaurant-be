import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ImageInterceptor } from './image.interceptor';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

describe('ImageInterceptor', () => {
  jest.setTimeout(7000);

  let imageInterceptor: ImageInterceptor;
  let context: Partial<ExecutionContext>;
  let next: Partial<CallHandler>;

  beforeAll(async () => {
    await cloudinary.config({
      cloud_name: await new ConfigService().get('CLOUDINARY_CLOUD_NAME'),
      api_key: await new ConfigService().get('CLOUDINARY_API_KEY'),
      api_secret: await new ConfigService().get('CLOUDINARY_API_SECRET'),
    });

    imageInterceptor = new ImageInterceptor();

    const filename = 'testImage.svg';

    const filePath = join(__dirname, '../../test', 'test.svg');
    const fileContent = await fs.readFile(filePath);

    await fs.writeFile(
      join(__dirname, '../../../uploads', filename),
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
    expect(imageInterceptor).toBeDefined();
  });

  it('should upload file and return url', async () => {
    await imageInterceptor.intercept(
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

    await imageInterceptor.intercept(
      context as ExecutionContext,
      next as CallHandler,
    );

    expect(context.switchToHttp().getRequest().imageUrl).not.toBeDefined();
  });
});

async function removeCloudinaryImage(image: string) {
  const url = image.split('/');
  await cloudinary.api.delete_resources([
    join('restaurants', url[url.length - 1].split('.')[0]),
  ]);
}
