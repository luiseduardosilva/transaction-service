export class InvalidWalletException extends Error {
    public statusCode: number;
    public error: unknown;
    constructor(props: {
        message: string;
        statusCode: number;
        error?: unknown;
    }) {
        const { message, statusCode, error } = props;
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }
}
