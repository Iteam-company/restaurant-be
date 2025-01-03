import { CallHandler, ExecutionContext } from '@nestjs/common';
import { CsvInterceptor } from './csv.interceptor';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('CsvInterceptor', () => {
  let csvInterceptor: CsvInterceptor;
  let context: Partial<ExecutionContext>;
  let next: Partial<CallHandler>;

  const inputData = `firstName,lastName,usaername,role,email,phoneNumber,password
John,Morgan,waiter,waiter,waiter@mail.com,+380000000010,qwertyuiop
John,Morgan,waiter1,waiter,waiter1@mail.com,+380000000011,qwertyuiop
John,Morgan,waiter2,waiter,waiter2@mail.com,+380000000012,qwertyuiop`;

  beforeAll(async () => {
    const filename = 'data.csv';

    await fs.writeFile(
      join(__dirname, '../../../uploads', filename),
      inputData,
    );

    const file = {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype: 'image/svg',
      filename: filename,
      destination: 'uploads',
      path: 'uploads/' + filename,
      size: inputData.length,
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

    csvInterceptor = await new CsvInterceptor();
  });

  it('should be defined', async () => {
    expect(csvInterceptor).toBeDefined();
  });

  it('should create few users', async () => {
    await csvInterceptor.intercept(
      <ExecutionContext>context,
      <CallHandler>next,
    );

    expect(context.switchToHttp().getRequest().fileData).toEqual(inputData);
  });
});
