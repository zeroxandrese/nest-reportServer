// src/database/database.providers.ts
import { DataSource } from 'typeorm';
import { Employee } from '../workcertificates/entities/employee.entity';
import { Payslip } from '../paid-certificates/entities/paid-certificate.entity';
import { PaySlipSaw } from '../paid-certificates/entities/payslipsaw.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Employee, Payslip, PaySlipSaw],
        synchronize: false,
        options: {
          encrypt: false,
        },
      });

      return dataSource.initialize();
    },
  },


  {
    provide: 'EMPLOYEE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Employee),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PAYSLIP_REPOSITORY', 
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Payslip),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PAYSLIPSAW_REPOSITORY', 
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PaySlipSaw),
    inject: ['DATA_SOURCE'],
  }
];