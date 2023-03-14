import { HttpStatus } from '@nestjs/common';

export class TransferIsRefundException extends Error {
    public statusCode: number;
    public error: unknown;
    constructor() {
        super(`it's a refund transfer`);
        this.statusCode = HttpStatus.NOT_FOUND;
    }
}
