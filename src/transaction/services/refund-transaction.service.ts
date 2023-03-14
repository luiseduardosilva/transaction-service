import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WalletWrapper } from '../../wrappers/external-service/wallet/wallet.wrapper';
import {
    IRefundTransactionService,
    RefundTransactionProps,
} from './interfaces';
import { ITransactionRepository } from '../repositories/interfaces';
import {
    InvalidTrasactionException,
    InvalidWalletException,
    InvalidTimeRefundException,
    TransferIsRefundException,
} from '../../exceptions';
import { TransactionSchema } from '../models';
import { transactionType } from '../../utils/enum/transaction-type';
import { IWalletWrapper } from '../../wrappers/external-service/wallet/interfaces';

@Injectable()
export class RefundTransactionService implements IRefundTransactionService {
    constructor(
        @Inject(ITransactionRepository)
        private readonly repository: ITransactionRepository,
        @Inject(IWalletWrapper)
        private readonly walletWrapper: IWalletWrapper,
    ) {}
    async execute(
        props: RefundTransactionProps,
    ): Promise<{ data: string; statusCode: number }> {
        const { id } = props;

        const Refund = await this.refund({ id });

        return this.response(Refund);
    }

    private async refund(props: { id: number }) {
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

            if (transfer.refundAt) {
                throw new TransferIsRefundException();
            }

            if (transfer.canceledAt) {
                throw new InvalidTrasactionException({
                    message: `it's a canceled transaction`,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            const isAvaliableTime = this.isAvaliableTime(transfer);

            if (!isAvaliableTime) {
                throw new InvalidTimeRefundException();
            }

            await this.repository.update({
                refundAt: new Date().toISOString(),
                id,
            });

            await this.createRefundTransfer({
                walletId: transfer.walletId,
                value: transfer.value * -1,
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

        return minutesSinceCreation >= TEN_MINUTES;
    }

    private async createRefundTransfer(props: {
        value: number;
        walletId: number;
    }): Promise<void> {
        const { value, walletId } = props;
        await this.repository.save({
            value,
            walletId,
            type: transactionType.CHARGE_BACK,
        });
    }

    private response(data: any): { data: string; statusCode: number } {
        if (
            data instanceof InvalidWalletException ||
            data instanceof InvalidTimeRefundException ||
            data instanceof TransferIsRefundException ||
            data instanceof InvalidTrasactionException
        ) {
            return {
                data: data.message,
                statusCode: data.statusCode,
            };
        }

        if (data instanceof InvalidTimeRefundException) {
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
            data: 'Transfer refunded',
            statusCode: HttpStatus.OK,
        };
    }
}
