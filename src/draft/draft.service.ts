import { Injectable, Inject } from '@nestjs/common';
import { ObjectID, Repository } from 'typeorm';
import { DraftEntity } from './draft.entity';
import { Constants } from '../common/constants';

@Injectable()
export class DraftService {
  constructor(
    @Inject(Constants.DRAFT_REPOSITORY)
    private draftRepository: Repository<DraftEntity>,
  ) {}

  async findAll(): Promise<DraftEntity[]> {
    return this.draftRepository.find();
  }

  async put(): Promise<DraftEntity> {
    const draftEntity = new DraftEntity();
    draftEntity.version = 1;
    return this.draftRepository.save(draftEntity);
  }
}
