import { HttpStatus } from '@nestjs/common';

export class TransferIsCancelledException extends Error {
    public statusCode: number;
    public error: unknown;
    constructor() {
        super(`it's a canceled transfer`);
        this.statusCode = HttpStatus.NOT_FOUND;
    }
}
