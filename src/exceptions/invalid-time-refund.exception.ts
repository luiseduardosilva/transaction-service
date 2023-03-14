import { HttpStatus } from '@nestjs/common';

export class InvalidTimeRefundException extends Error {
    public statusCode: number;
    public error: unknown;
    constructor() {
        super('At minimum 10 minutes to refund');
        this.statusCode = HttpStatus.NOT_FOUND;
    }
}
