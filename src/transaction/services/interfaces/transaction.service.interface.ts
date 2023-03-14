export type TransactionProps = {
    walletId: number;
    type: 1 | 2;
    value: number;
};

export type TransactionResponse = { data: string; statusCode: number };

export interface ITransactionService {
    execute(props: TransactionProps): Promise<TransactionResponse>;
}

export const ITransactionService = Symbol('ITransactionService');
