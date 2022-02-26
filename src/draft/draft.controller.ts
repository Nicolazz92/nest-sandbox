import { Controller, Get, Put, Req, Patch } from '@nestjs/common';
import { DraftService } from './draft.service';
import { DraftEntity } from './draft.entity';
import { Request } from 'express';
import { Result } from '../common/http/Result';

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Get('all')
  findAll(): Promise<DraftEntity[]> {
    return this.draftService.findAll();
  }

  @Put()
  put(@Req() request: Request): Promise<Result> {
    return this.draftService.put(request);
  }

  @Patch()
  patch(@Req() request: Request): Promise<Result> {
    return this.draftService.patch(request);
  }
}
