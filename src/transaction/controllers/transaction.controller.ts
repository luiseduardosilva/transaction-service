import {
    Controller,
    Post,
    Body,
    Put,
    Param,
    Res,
    HttpStatus,
    Get,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CancelTransactionService } from '../services/cancel-transaction.service';
import { RefundTransactionService } from '../services/refund-transaction.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTransactionService } from '../services/get-transaction.service';

const apiVersion = 'v1';

@Controller(`api/${apiVersion}/transactions`)
@ApiTags('transactions')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly cancelTransactionService: CancelTransactionService,
        private readonly refundTransactionService: RefundTransactionService,
        private readonly getTransactionService: GetTransactionService,
    ) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        schema: {
            default: {
                data: 'Transfer ok',
                statusCode: 201,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
            default: {
                data: 'Error message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        schema: {
            default: {
                data: 'message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiBody({
        schema: {
            example: {
                walletId: 2,
                value: 1000,
                type: 1,
            },
        },
    })
    @Post()
    async create(
        @Res() res,
        @Body() createTransactionDto: CreateTransactionDto,
    ) {
        const transaction = await this.transactionService.execute(
            createTransactionDto,
        );
        return res.status(transaction?.statusCode).json(transaction);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        schema: {
            default: {
                data: 'Transfer cancelled',
                statusCode: 201,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
            default: {
                data: 'Error message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        schema: {
            default: {
                data: 'message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiBody({
        schema: {
            example: {},
        },
    })
    @Put('/cancel/:id')
    async cancel(@Res() res, @Param('id') id: number) {
        const transaction = await this.cancelTransactionService.execute({
            id,
        });

        return res.status(transaction?.statusCode).json(transaction);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        schema: {
            default: {
                data: 'Transfer refund',
                statusCode: 201,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
            default: {
                data: 'Error message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        schema: {
            default: {
                data: 'message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiBody({
        schema: {
            example: {},
        },
    })
    @Put('/refund/:id')
    async refund(@Res() res, @Param('id') id: number) {
        const transaction = await this.refundTransactionService.execute({
            id,
        });
        return res.status(transaction?.statusCode).json(transaction);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        schema: {
            default: {
                data: [
                    {
                        id: 1,
                        value: -1000,
                        type: 2,
                        canceledAt: null,
                        refundAt: null,
                        walletId: 1,
                        createdAt: '2023-03-11T20:35:10.466Z',
                        updatedAt: '2023-03-11T20:35:10.466Z',
                    },
                    {
                        id: 1,
                        value: -1000,
                        type: 2,
                        canceledAt: null,
                        refundAt: null,
                        walletId: 1,
                        createdAt: '2023-03-11T20:35:11.122Z',
                        updatedAt: '2023-03-11T20:35:11.122Z',
                    },
                ],
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
            default: {
                data: 'Error message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        schema: {
            default: {
                data: 'message',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
        },
    })
    @Get('/statement/:walletId')
    async statima(@Res() res, @Param('walletId') walletId: number) {
        const transaction = await this.getTransactionService.execute({
            walletId,
        });
        return res.status(transaction?.statusCode).json(transaction);
    }
}
