import { Body, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DraftEntity } from './draft.entity';
import { Constants } from '../common/constants';
import { Result } from '../common/http/Result';
import putSave from 'src/common/http/putSave';
import { Request } from 'express';
import { classToPlain, instanceToPlain } from 'class-transformer';

@Injectable()
export class DraftService {
  constructor(
    @Inject(Constants.DRAFT_REPOSITORY)
    private draftRepository: Repository<DraftEntity>,
  ) {}

  async findAll(): Promise<DraftEntity[]> {
    return this.draftRepository.find();
  }

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

  private static parseParameters(request: Request) {
    let parameterStr;
    if (
      typeof request.body === 'object' &&
      typeof request.body.parameters === 'string'
    ) {
      parameterStr = request.body.parameters;
    }
    console.log(`parameterStr=${parameterStr}`);
    return JSON.parse(parameterStr);
  }
}
