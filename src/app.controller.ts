import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async qq() {
    return 'qq';
  }

  @Get('qq')
  async qq1() {
    return 'qwerty';
  }
}
