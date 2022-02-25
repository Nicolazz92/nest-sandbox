import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { draftProviders } from './draft.providers';
import { DraftService } from './draft.service';
import { DraftController } from './draft.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...draftProviders, DraftService],
  controllers: [DraftController],
})
export class DraftModule {}
