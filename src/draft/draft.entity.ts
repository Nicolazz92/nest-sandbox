import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class DraftEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  asGuid?: string;

  @VersionColumn()
  version: number;

  @Column()
  user: number;

  @Column({ type: 'datetime' })
  date: Date;
}
