import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WalletWrapper } from '../../wrappers/external-service/wallet/wallet.wrapper';
import { transactionType } from '../../utils/enum/transaction-type';
import {
    ITransactionService,
    TransactionProps,
    TransactionResponse,
} from './interfaces';
import { ITransactionRepository } from '../repositories/interfaces';
import { DatabaseException, InvalidWalletException } from '../../exceptions/';
import { IWalletWrapper } from '../../wrappers/external-service/wallet/interfaces';

@Injectable()
export class TransactionService implements ITransactionService {
    constructor(
        @Inject(ITransactionRepository)
        private readonly repository: ITransactionRepository,
        @Inject(IWalletWrapper)
        private readonly walletWrapper: IWalletWrapper,
    ) {}
    async execute(props: TransactionProps): Promise<TransactionResponse> {
        const { type, value, walletId } = props;

        const transfer = await this.transfer({ walletId, type, value });

        return this.response(transfer);
    }

    private response(
        data: any | InvalidWalletException | Error | DatabaseException,
    ) {
        if (
            data instanceof InvalidWalletException ||
            data instanceof DatabaseException
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
            data: 'Transfer ok',
            statusCode: HttpStatus.CREATED,
        };
    }

    private async transfer(props: {
        walletId: number;
        type: 1 | 2;
        value: number;
    }): Promise<boolean | InvalidWalletException | DatabaseException> {
        const { walletId, type, value } = props;
        try {
            const hasWallet = await this.walletWrapper.getWallet({
                id: walletId,
            });

            if (!hasWallet) {
                throw new InvalidWalletException({
                    message: 'Invalid WalletId',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            const transferMapper = {
                [transactionType.TRANSFER]: async () =>
                    this.executeTransfer({ walletId, value }),
                [transactionType.BUY]: async () =>
                    this.executeTransferBuy({ walletId, value }),
            };

            const transfer = await transferMapper[type]();

            if (transfer instanceof DatabaseException) {
                throw transfer;
            }

            return !!transfer;
        } catch (error) {
            return error;
        }
    }

    async executeTransferBuy(props: {
        walletId: number;
        value: number;
    }): Promise<boolean | DatabaseException> {
        try {
            const { walletId, value } = props;

            const buyValue = (value: number) => (value >= 1 ? -value : value);

            const transaction = await this.repository.save({
                value: buyValue(value),
                walletId,
                type: transactionType.BUY,
            });

            if (transaction instanceof DatabaseException) {
                throw transaction;
            }

            if (!transaction) {
                throw new DatabaseException();
            }

            await this.walletWrapper.changeWalletBalance({
                id: walletId,
                value: buyValue(value),
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    async executeTransfer(props: {
        walletId: number;
        value: number;
    }): Promise<boolean | Error> {
        try {
            const { walletId, value } = props;
            const transaction = await this.repository.save({
                value,
                walletId,
                type: transactionType.TRANSFER,
            });

            if (transaction instanceof DatabaseException) {
                throw transaction;
            }

            if (!transaction) {
                throw new DatabaseException();
            }

            await this.walletWrapper.changeWalletBalance({
                id: walletId,
                value,
            });

            return true;
        } catch (error) {
            return error;
        }
    }
}
