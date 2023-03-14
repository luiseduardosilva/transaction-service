export type RefundTransactionProps = {
    id: number;
};

export interface IRefundTransactionService {
    execute(
        props: RefundTransactionProps,
    ): Promise<{ data: string; statusCode: number } | Error>;
}

export const IRefundTransactionService = Symbol('IRefundTransactionService');
