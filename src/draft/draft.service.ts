import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DraftEntity } from './draft.entity';
import { Constants } from '../common/constants';
import { Result } from '../common/http/Result';
import putSave from 'src/common/http/putSave';
import patch from 'src/common/http/patch';
import { Request } from 'express';
import { instanceToPlain } from 'class-transformer';
import versions from 'src/common/http/versions';
import byVersion from 'src/common/http/byVersion';
import * as fs from 'fs';

@Injectable()
export class DraftService {
  constructor(
    @Inject(Constants.DRAFT_REPOSITORY)
    private draftRepository: Repository<DraftEntity>,
  ) {}

  async put(request: Request): Promise<Result> {
    const result = new Result();
    try {
      const parameters: putSave = DraftService.parseParameters(request);
      await this.draftRepository
        .findOne({
          where: {
            user: parameters.user,
            asGuid: parameters.asGuid,
          },
          select: ['version'],
          order: { version: 'DESC' },
        })
        .then((last) => {
          const draftEntity = new DraftEntity();
          draftEntity.version = last ? last.version + 1 : 1;
          draftEntity.user = parameters.user;
          draftEntity.asGuid = parameters.asGuid;
          draftEntity.date = new Date();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const datum: Express.Multer.File = request.files.data[0];
          draftEntity.draftData = datum.buffer;
          return this.draftRepository
            .save(draftEntity)
            .then((savedDraft) => {
              result.setId(savedDraft.id.toString());
              console.log(`savedDraft=${result.id}`);
            })
            .catch((e) => {
              console.log(e);
              result.addError('Ошибка сохранения', e);
            });
        });
    } catch (e) {
      console.log(e);
      result.addError('Ошибка сохранения', e);
    }
    return instanceToPlain(result) as Result;
  }

  async patch(request: Request): Promise<Result> {
    const result = new Result();
    try {
      const parameters: patch = DraftService.parseParameters(request);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const datum: Express.Multer.File = request.files.data[0];
      await this.draftRepository
        .update(
          {
            user: parameters.user,
            asGuid: parameters.asGuid,
            version: parameters.version,
          },
          {
            draftData: datum.buffer,
            date: new Date(),
          },
        )
        .then((res) => {
          result.affected = res.affected;
          res.generatedMaps.forEach(console.log);
        })
        .catch((e) => {
          console.log(e);
          result.addError('Ошибка обновления', e);
        });
    } catch (e) {
      console.log(e);
    }
    return instanceToPlain(result) as Result;
  }

  async versions(request: Request): Promise<number[]> {
    const parameters: versions = DraftService.parseParameters(request);
    return await this.draftRepository
      .find({
        where: {
          user: parameters.user,
          asGuid: parameters.asGuid,
        },
        select: ['version'],
        order: { version: 'DESC' },
      })
      .then((draftEntity) => draftEntity.map((de) => de.version));
  }

  async byVersion(request: Request): Promise<StreamableFile> {
    const parameters: byVersion = DraftService.parseParameters(request);
    return await this.draftRepository
      .findOne({
        where: {
          user: parameters.user,
          asGuid: parameters.asGuid,
          version: parameters.version,
        },
      })
      .then((draftEntity) => {
        const draftData = draftEntity.draftData;
        console.log(`draftData=${draftData}`);
        return new StreamableFile(draftData);
      });
  }

  async last(request: Request): Promise<StreamableFile> {
    const parameters: versions = DraftService.parseParameters(request);
    return await this.draftRepository
      .findOne({
        where: {
          user: parameters.user,
          asGuid: parameters.asGuid,
        },
        order: { version: 'DESC' },
      })
      .then((draftEntity) => {
        const draftData = draftEntity.draftData;
        console.log(`draftData=${draftData}`);
        return new StreamableFile(draftData);
      });
  }

  async delete(request: Request): Promise<Result> {
    const result = new Result();
    try {
      const parameters: byVersion = DraftService.parseParameters(request);
      await this.draftRepository
        .delete({
          user: parameters.user,
          asGuid: parameters.asGuid,
          version: parameters.version,
        })
        .then((draft) => {
          result.affected = draft.affected;
        })
        .catch((e) => {
          console.log(e);
          result.addError('Ошибка удаления', e);
        });
    } catch (e) {
      console.log(e);
      result.addError('Ошибка удаления', e);
    }
    return result;
  }

  private static parseParameters(request: Request) {
    // console.log(`parameterStr=${parameterStr}`);
    return JSON.parse(request.body.parameters);
  }
}
