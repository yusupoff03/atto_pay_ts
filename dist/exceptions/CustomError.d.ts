export declare class CustomError extends Error {
    info: any | undefined;
    constructor(name: string, originalMessage?: string, info?: any);
}
