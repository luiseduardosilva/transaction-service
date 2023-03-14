import { HttpStatus } from '@nestjs/common';
import { TransactionSchema } from '../../models';

export type GetTransactionProps = {
    walletId: number;
};

export type GetTransactionResponse = {
    data: TransactionSchema[] | string;
    statusCode: HttpStatus;
};

export interface IGetTransactionService {
    execute(porps: GetTransactionProps): Promise<GetTransactionResponse>;
}
