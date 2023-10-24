export declare class HttpException extends Error {
    status: number;
    info: undefined;
    message: string;
    constructor(status: number, message: string);
}
