import { Test, TestingModule } from '@nestjs/testing';

import { ITransactionService, TransactionProps } from '../services/interfaces';
import { ITransactionRepository } from '../repositories/interfaces';
import { TransactionService } from '../services/transaction.service';
import { IWalletWrapper } from '../../wrappers/external-service/wallet/interfaces';
import { DatabaseException } from '../../exceptions';

describe('CreateWalletService', () => {
    let service: ITransactionService;
    let transcationRepository: ITransactionRepository;
    let walletWrapper: IWalletWrapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionService,
                {
                    provide: ITransactionRepository,
                    useValue: {
                        save: jest.fn().mockResolvedValue({}),
                    },
                },
                {
                    provide: IWalletWrapper,
                    useValue: {
                        getWallet: jest.fn().mockResolvedValue(true),
                    },
                },
            ],
        }).compile();

        service = module.get<ITransactionService>(TransactionService);
        transcationRepository = module.get<ITransactionRepository>(
            ITransactionRepository,
        );
        walletWrapper = module.get<IWalletWrapper>(IWalletWrapper);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(transcationRepository).toBeDefined();
    });

    describe('create transcation', () => {
        it('should be return ok', async () => {
            const params = {
                type: 1,
                value: 10,
                walletId: 1,
            } as TransactionProps;
            const result = await service.execute(params);

            expect(result).toStrictEqual({
                data: 'Transfer ok',
                statusCode: 201,
            });
            expect(transcationRepository.save).toHaveBeenCalledWith(params);
            expect(transcationRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should be return database Error', async () => {
            jest.spyOn(transcationRepository, 'save').mockResolvedValue(
                new DatabaseException(),
            );
            const params = {
                type: 1,
                value: 10,
                walletId: 1,
            } as TransactionProps;
            const result = await service.execute(params);

            expect(result).toStrictEqual({
                data: 'Database error',
                statusCode: 500,
            });
            expect(transcationRepository.save).toHaveBeenCalledWith(params);
            expect(transcationRepository.save).toHaveBeenCalledTimes(1);
            expect(walletWrapper.getWallet).toHaveBeenCalledWith({
                id: params.walletId,
            });
            expect(walletWrapper.getWallet).toHaveBeenCalledTimes(1);
        });

        it('should be return Invalid WalletId', async () => {
            jest.spyOn(walletWrapper, 'getWallet').mockResolvedValue(null);
            const params = {
                type: 1,
                value: 10,
                walletId: 1,
            } as TransactionProps;
            const result = await service.execute(params);

            expect(result).toStrictEqual({
                data: 'Invalid WalletId',
                statusCode: 404,
            });
            expect(transcationRepository.save).toHaveBeenCalledTimes(0);
        });
    });
});
