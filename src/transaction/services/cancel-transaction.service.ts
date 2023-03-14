import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WalletWrapper } from '../../wrappers/external-service/wallet/wallet.wrapper';
import {
    ICancelTransactionService,
    CancelTransactionProps,
} from './interfaces/';
import { ITransactionRepository } from '../repositories/interfaces';
import {
    InvalidTrasactionException,
    InvalidWalletException,
    InvalidTimeCancelException,
    TransferIsCancelledException,
} from '../../exceptions';
import { TransactionSchema } from '../models';
import { transactionType } from '../../utils/enum/transaction-type';
import { IWalletWrapper } from '../../wrappers/external-service/wallet/interfaces';

@Injectable()
export class CancelTransactionService implements ICancelTransactionService {
    constructor(
        @Inject(ITransactionRepository)
        private readonly repository: ITransactionRepository,
        @Inject(IWalletWrapper)
        private readonly walletWrapper: IWalletWrapper,
    ) {}
    async execute(
        props: CancelTransactionProps,
    ): Promise<{ data: string; statusCode: number }> {
        const { id } = props;

        const cancel = await this.cancel({ id });

        return this.response(cancel);
    }

    private async cancel(props: { id: number }) {
        try {
            const { id } = props;
            const transfer = await this.repository.findById({ id });

            if (!transfer) {
                throw new InvalidTrasactionException({
                    message: 'Invalid transfer',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            if (transfer.type !== transactionType.BUY) {
                throw new InvalidTrasactionException({
                    message: `transaction is don't a buy`,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            if (transfer.canceledAt) {
                throw new TransferIsCancelledException();
            }

            if (transfer.refundAt) {
                throw new InvalidTrasactionException({
                    message: `it's a refund transaction`,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            const isAvaliableTime = this.isAvaliableTime(transfer);

            if (!isAvaliableTime) {
                throw new InvalidTimeCancelException();
            }

            await this.repository.update({
                canceledAt: new Date().toISOString(),
                id,
            });

            await this.walletWrapper.changeWalletBalance({
                id: transfer.walletId,
                value: transfer.value * -1,
            });
        } catch (error) {
            return error;
        }
    }

    private isAvaliableTime(transaction: TransactionSchema): boolean {
        const MINUTE_IN_MILESECONDES = 60000;
        const TEN_MINUTES = 10;
        const diffInMinutes = (date1: Date, date2: Date) => {
            return Math.round(
                (date2.getTime() - date1.getTime()) / MINUTE_IN_MILESECONDES,
            );
        };

        const createdAt = new Date(transaction.createdAt);
        const now = new Date();

        const minutesSinceCreation = diffInMinutes(createdAt, now);

        return minutesSinceCreation <= TEN_MINUTES;
    }

    private response(data: any): { data: string; statusCode: number } {
        if (
            data instanceof InvalidWalletException ||
            data instanceof InvalidTimeCancelException ||
            data instanceof TransferIsCancelledException ||
            data instanceof InvalidTrasactionException
        ) {
            return {
                data: data.message,
                statusCode: data.statusCode,
            };
        }

        if (data instanceof Error) {
            return {
                data: 'Internal error server',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }

        return {
            data: 'Transfer cancelled',
            statusCode: HttpStatus.OK,
        };
    }
}
