import { HttpStatus } from '@nestjs/common';

export class InvalidTimeCancelException extends Error {
    public statusCode: number;
    public error: unknown;
    constructor() {
        super('At maximum 10 minutes to cancel');
        this.statusCode = HttpStatus.NOT_FOUND;
    }
}
