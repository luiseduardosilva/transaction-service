import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InvalidWalletException } from '../../exceptions';
// import { LogService } from '../../utils/log/log.service';
import { TransactionSchema } from '../models';
import { ITransactionRepository } from '../repositories/interfaces';
import {
    GetTransactionProps,
    GetTransactionResponse,
    IGetTransactionService,
} from './interfaces';

@Injectable()
export class GetTransactionService implements IGetTransactionService {
    constructor(
        @Inject(ITransactionRepository)
        private readonly repository: ITransactionRepository, // private readonly logService: LogService,
    ) {}

    async execute(props: GetTransactionProps): Promise<GetTransactionResponse> {
        const { walletId } = props;

        const transaction = await this.getTransaction({ walletId });

        return this.response(transaction);
    }

    private async getTransaction(
        props: GetTransactionProps,
    ): Promise<TransactionSchema[]> {
        try {
            const { walletId } = props;
            const transactions = await this.repository.findByWallet({
                walletId,
            });
            if (!transactions) {
                throw new InvalidWalletException({
                    message: 'Invalid WalletId',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            return transactions;
        } catch (error) {
            // await this.logService.execute({
            //     message: 'Error to get Transaction',
            // });
            // await this.logService.execute({
            //     message: error,
            // });
            return error;
        }
    }

    private response(data: any): {
        data: TransactionSchema[] | string;
        statusCode: number;
    } {
        if (data instanceof InvalidWalletException) {
            return {
                data: data.message,
                statusCode: data.statusCode,
            };
        }

        if (data instanceof Error) {
            return {
                data: 'Internal server Error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }

        return {
            data: data,
            statusCode: HttpStatus.OK,
        };
    }
}
