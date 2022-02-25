import { Module } from '@nestjs/common';
// import { AppController } from './controller/app.controller';
import { AppService } from './app.service';
import { DraftModule } from './draft/draft.module';

@Module({
  imports: [DraftModule],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
