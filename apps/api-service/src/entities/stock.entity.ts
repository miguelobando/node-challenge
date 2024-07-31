import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class stock {
  @PrimaryColumn('varchar')
  'symbol': string;
  @PrimaryColumn('date')
  'date': Date;
  @PrimaryColumn('time')
  'time': string;
  @Column('integer')
  'open': number;
  @Column('integer')
  'high': number;
  @Column('integer')
  'low': number;
  @Column('integer')
  'close': number;
  @Column('integer')
  'volume': number;
  @PrimaryColumn('varchar')
  'name': string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  insertdate: Date;
}
