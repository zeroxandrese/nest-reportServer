import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbPaySlipSaw')
export class PaySlipSaw {

  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Documento: string;

  @Column()
  Ciclo: string;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  FechaVista: Date;

}