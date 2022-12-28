export interface TokenEntity {
    email: string;
    card_number: string;
    cvv: string;
    expiration_year: string;
    expiration_month: string;
    token: string;
    created_at: Date;
}
