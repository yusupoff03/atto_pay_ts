export declare class CreateCustomerDto {
    name: string;
    phone: string;
    password: string;
}
export declare class UpdateCustomerDto {
    name?: string;
    password?: string;
    image?: any;
    deleteImage?: boolean;
}
export declare class CustomerLoginDto {
    phone: string;
    password?: string;
    otp?: string;
}
