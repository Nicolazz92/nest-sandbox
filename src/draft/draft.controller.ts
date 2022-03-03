import { Controller, Get, Put, Req, Patch, Delete, Res } from '@nestjs/common';
import { DraftService } from './draft.service';
import { Request, Response } from 'express';
import { Result } from '../common/http/Result';

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Put()
  put(@Req() request: Request): Promise<Result> {
    console.log(request);
    return this.draftService.put(request);
  }

  @Patch()
  patch(@Req() request: Request): Promise<Result> {
    return this.draftService.patch(request);
  }

  @Get('versions')
  versions(@Req() request: Request): Promise<number[]> {
    return this.draftService.versions(request);
  }

  @Get('by-version')
  byVersion(@Req() request: Request): Promise<Record<string, string>> {
    return this.draftService.byVersion(request);
  }

  @Get('last')
  last(@Req() request: Request): Promise<Record<string, string>> {
    return this.draftService.last(request);
  }

  @Delete()
  delete(@Req() request: Request): Promise<Result> {
    return this.draftService.delete(request);
  }
}
