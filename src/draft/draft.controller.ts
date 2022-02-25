import { Controller, Get, Put } from '@nestjs/common';
import { DraftService } from './draft.service';
import { DraftEntity } from './draft.entity';

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Get('all')
  findAll(): Promise<DraftEntity[]> {
    return this.draftService.findAll();
  }

  @Put()
  put(): Promise<DraftEntity> {
    return this.draftService.put();
  }
}
