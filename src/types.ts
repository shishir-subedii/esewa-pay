export interface EsewaConfig {
    secretKey: string;
    productCode: string;
    successUrl: string;
    failureUrl: string;
    env?: "development" | "production";
}

export interface PaymentParams {
    amount: string;
    tax_amount?: string;
    product_service_charge?: string;
    product_delivery_charge?: string;
    total_amount: string;
    transaction_uuid: string;
}

export interface VerifyResponse {
    transaction_code: string;
    status: string;
    total_amount: number;
    signed_field_names: string;
    transaction_uuid: string;
    product_code: string;
    signature: string;
}

export interface StatusResponse {
    product_code: string;
    transaction_uuid: string;
    total_amount: number;
    status: string;
    ref_id?: string;
}
