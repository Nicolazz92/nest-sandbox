import {
  Controller,
  Get,
  Put,
  Req,
  Patch,
  Delete,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { DraftService } from './draft.service';
import { Request, Response } from 'express';
import { Result } from '../common/http/Result';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Put()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'data' }]))
  put(@Req() request: Request): Promise<Result> {
    return this.draftService.put(request);
  }

  @Patch()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'data' }]))
  patch(@Req() request: Request): Promise<Result> {
    return this.draftService.patch(request);
  }

  @Get('versions')
  versions(@Req() request: Request): Promise<number[]> {
    return this.draftService.versions(request);
  }

  @Get('by-version')
  byVersion(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<StreamableFile> {
    response.set({
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': 'attachment; filename="result.txt"',
    });
    return this.draftService.byVersion(request);
  }

  @Get('last')
  last(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<StreamableFile> {
    response.set({
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': 'attachment; filename="result.txt"',
    });
    return this.draftService.last(request);
  }

  @Delete()
  delete(@Req() request: Request): Promise<Result> {
    return this.draftService.delete(request);
  }
}
