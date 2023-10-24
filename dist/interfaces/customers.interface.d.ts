export interface Customer {
    id?: string;
    name: string;
    trust?: boolean;
    phone: string;
    image_url?: string;
    password?: string;
    hashed_password?: string;
    balance?: number;
}
export interface UpdateCustomerData {
    name: string;
    password?: string;
    gender: string;
    birthDate: string;
    deleteImage?: boolean | false;
}
export interface CustomerLogin {
    phone: string;
    password?: string;
    otp?: string;
    trust: boolean;
}
