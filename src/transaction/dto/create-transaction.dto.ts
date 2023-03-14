import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
export class CreateTransactionDto {
    @ApiProperty({
        required: true,
        description: 'reference wallet ID',
        default: 1,
        type: Number,
    })
    @IsNumber()
    walletId: number;

    @ApiProperty({
        required: true,
        description: 'value transcations',
        default: 1.0,
        type: Number,
    })
    @IsNumber()
    value: number;

    @ApiProperty({
        required: true,
        description: 'transaction type, buy or transfer',
        enum: [1, 2],
        type: Number,
    })
    @IsNumber()
    @IsEnum([1, 2])
    type: 1 | 2;
}
