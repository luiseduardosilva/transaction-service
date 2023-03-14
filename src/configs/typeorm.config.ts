import { DataSource, DataSourceOptions } from 'typeorm';
import { TransactionModel } from '../transaction/models';

const { LOG_QUERY, DB_HOST, DB_PORT, DB_PASSOWRD, DB_USER, DB_NAME } =
    process.env;

console.log({
    DB_HOST,
    DB_PORT,
    LOG_QUERY,
});

export const dataSourceOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSOWRD,
    database: DB_NAME,
    schema: 'public',
    synchronize: false,
    logging: LOG_QUERY,
    entities: [TransactionModel],
    migrations: ['./dist/database/migrations/**/*{.ts,.js}'],
    extra: {
        connectionLimit: 5,
    },
    cli: {
        migrationsDir: './src/database/migrations',
    },
} as DataSourceOptions;

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
