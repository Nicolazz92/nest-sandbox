import { Connection } from 'typeorm';
import { DraftEntity } from './draft.entity';
import { Constants } from '../common/constants';

export const draftProviders = [
  {
    provide: Constants.DRAFT_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(DraftEntity),
    inject: [Constants.DATABASE_CONNECTION],
  },
];
