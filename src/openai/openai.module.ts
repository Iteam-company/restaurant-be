import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [MenuModule],
  exports: [OpenaiService],
  providers: [OpenaiService],
})
export class OpenaiModule {}
