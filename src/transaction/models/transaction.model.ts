import {
    Entity,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryColumn,
    Generated,
} from 'typeorm';
import { transactionType } from '../../utils/enum/transaction-type';

export interface TransactionSchema {
    id: number;
    value: number;
    type: transactionType;
    walletId: number;
    canceledAt: string;
    refundAt: string;
    createdAt: string;
    updatedAt: string;
}

@Entity('transactions')
export class TransactionModel implements TransactionSchema {
    @PrimaryColumn({ name: 'id' })
    @Generated('increment')
    id: number;

    @Column({ name: 'value' })
    value: number;

    @Column({ name: 'type' })
    type: transactionType;

    @Column({ name: 'canceled_at' })
    canceledAt: string;

    @Column({ name: 'refund_at' })
    refundAt: string;

    @Column({ name: 'wallet_id' })
    walletId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: string;
}
