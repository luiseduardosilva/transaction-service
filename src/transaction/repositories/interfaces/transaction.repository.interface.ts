import { DatabaseException } from '../../../exceptions';
import { transactionType } from '../../../utils/enum/transaction-type';
import { TransactionSchema } from '../../models';

export type GetByWalletProps = {
    id: number;
};

export type SaveTransantionProps = {
    value: number;
    walletId: number;
    type: transactionType;
};

export type UpdateTransantionProps = {
    id: number;
    canceledAt?: string;
    refundAt?: string;
};

export type GetTransantionProps = {
    id: number;
};

export type GetTransactionsProps = {
    walletId: number;
};

export interface ITransactionRepository {
    save(
        props: SaveTransantionProps,
    ): Promise<TransactionSchema | DatabaseException>;
    update(props: UpdateTransantionProps): Promise<void>;
    findByWallet(props: GetTransactionsProps): Promise<TransactionSchema[]>;
    findById(props: GetTransantionProps): Promise<TransactionSchema>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');
