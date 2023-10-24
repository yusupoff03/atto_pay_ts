export interface Merchant {
    id?: string;
    name: string;
    email: string;
    password?: string;
    hashed_password?: string;
}
