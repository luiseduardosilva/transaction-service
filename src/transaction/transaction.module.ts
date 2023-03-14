import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModel } from './models';
import { ITransactionRepository } from './repositories/interfaces';
import { TransactionRepository } from './repositories';
import { CancelTransactionService } from './services/cancel-transaction.service';
import { RefundTransactionService } from './services/refund-transaction.service';
import { LoggerWrapper } from '../wrappers';
import { GetTransactionService } from './services/get-transaction.service';
import { IWalletWrapper } from '../wrappers/external-service/wallet/interfaces';

import { WalletWrapper } from '../wrappers/external-service/wallet/wallet.wrapper';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionModel])],
    controllers: [TransactionController],
    providers: [
        {
            useClass: TransactionRepository,
            provide: ITransactionRepository,
        },
        {
            useClass: WalletWrapper,
            provide: IWalletWrapper,
        },
        TransactionService,
        CancelTransactionService,
        RefundTransactionService,
        GetTransactionService,
        LoggerWrapper,
    ],
})
export class TransactionModule {}
