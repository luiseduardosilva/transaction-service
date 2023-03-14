import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './configs/typeorm.config';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerWrapper } from './wrappers';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(dataSourceOptions),
        TransactionModule,
    ],
    controllers: [],
    providers: [LoggerWrapper],
})
export class AppModule {}
