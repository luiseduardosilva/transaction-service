export type CancelTransactionProps = {
    id: number;
};

export interface ICancelTransactionService {
    execute(
        props: CancelTransactionProps,
    ): Promise<{ data: string; statusCode: number } | Error>;
}

export const ICancelTransactionService = Symbol('ICancelTransactionService');
