import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionModel, TransactionSchema } from '../models';
import { Repository } from 'typeorm';

import {
    UpdateTransantionProps,
    GetTransantionProps,
    ITransactionRepository,
    SaveTransantionProps,
    GetTransactionsProps,
} from './interfaces/transaction.repository.interface';
import { DatabaseException } from '../../exceptions';

import { LoggerWrapper } from '../../wrappers';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    @InjectRepository(TransactionModel)
    private readonly repository: Repository<TransactionModel>;
    constructor(private readonly loggerWrapper: LoggerWrapper) {}
    async save(
        props: SaveTransantionProps,
    ): Promise<TransactionSchema | DatabaseException> {
        try {
            const { type, value, walletId } = props;

            const params = {
                type,
                value,
                walletId,
            };

            const transaction = await this.repository.save(params);

            if (!transaction) {
                throw new DatabaseException();
            }

            return transaction;
        } catch (error) {
            await this.loggerWrapper.execute({
                message: 'error to save transaction in database',
                error,
            });
            throw error;
        }
    }
    async update(props: UpdateTransantionProps): Promise<void> {
        try {
            const { canceledAt, id, refundAt } = props;

            const params = {
                ...(canceledAt && { canceledAt }),
                ...(refundAt && { refundAt }),
            };

            await this.repository.update(
                {
                    id,
                },
                params,
            );
        } catch (error) {
            await this.loggerWrapper.execute({
                message: 'error to update transaction in database',
                error,
            });
            throw error;
        }
    }

    async findByWallet(
        props: GetTransactionsProps,
    ): Promise<TransactionSchema[]> {
        const { walletId } = props;
        const transactions = await this.repository.find({
            where: {
                walletId,
            },
        });
        return transactions;
    }

    async findById(props: GetTransantionProps): Promise<TransactionSchema> {
        try {
            const { id } = props;
            const transaction = await this.repository.findOne({
                where: {
                    id,
                },
            });
            return transaction;
        } catch (error) {
            await this.loggerWrapper.execute({
                message: 'error to get transaction in database',
                error,
            });
            throw error;
        }
    }
}
