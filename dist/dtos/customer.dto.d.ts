export declare class CreateCustomerDto {
    name: string;
    phone: string;
    password: string;
}
export declare class UpdateCustomerDto {
    name?: string;
    image?: any;
    deleteImage?: boolean;
    gender?: string;
    birthDate?: string;
}
export declare class CustomerLoginDto {
    phone: string;
    password?: string;
    otp?: string;
}
export declare class LoginTypeDto {
    phone: string;
}
