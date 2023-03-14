import { HttpStatus } from '@nestjs/common';

export class DatabaseException extends Error {
    public statusCode: number;
    public error: unknown;
    constructor() {
        super(`Database error`);
        this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
