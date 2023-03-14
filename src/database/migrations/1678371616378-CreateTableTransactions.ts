import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransactions1678371616378
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const createTransactionTable = `
        
        CREATE TABLE IF NOT EXISTS "transactions"
            (
                "id"            SERIAL      NOT NULL PRIMARY KEY,
                "value"         DECIMAL     NOT NULL DEFAULT  0.0,
                "type"          INT         NOT NULL,
                "wallet_id"     BIGINT      NOT NULL,
                "canceled_at"   TIMESTAMP,
                "refund_at" TIMESTAMP,
                "created_at"    TIMESTAMP   NOT NULL DEFAULT now(),
                "updated_at"    TIMESTAMP   NOT NULL DEFAULT now()
            );        
        `;

        await queryRunner.manager.query(createTransactionTable);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dropTransactionTable = `DROP TABLE IF EXISTS "transactions";`;
        await queryRunner.manager.query(dropTransactionTable);
    }
}
