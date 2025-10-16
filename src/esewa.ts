import axios, { AxiosResponse } from "axios";
import { generateHmacSha256 } from "./utils/crypto";
import { API_URLS, STATUS_URLS } from "./config";
import type { EsewaConfig, PaymentParams, StatusResponse, VerifyResponse } from "./types";

export class EsewaClient {
    private config: EsewaConfig;
    private baseUrl: string;
    private statusUrl: string;

    constructor(config: EsewaConfig) {
        this.config = config;
        this.baseUrl = API_URLS[config.env || "development"];
        this.statusUrl = STATUS_URLS[config.env || "development"];
    }

    generateSignature(total_amount: string, transaction_uuid: string, product_code: string): string {
        const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        return generateHmacSha256(data, this.config.secretKey);
    }

    async initiatePayment(params: PaymentParams): Promise<string> {
        const signature = this.generateSignature(params.total_amount, params.transaction_uuid, this.config.productCode);

        const payload = {
            amount: params.amount,
            tax_amount: params.tax_amount || "0",
            product_service_charge: params.product_service_charge || "0",
            product_delivery_charge: params.product_delivery_charge || "0",
            total_amount: params.total_amount,
            transaction_uuid: params.transaction_uuid,
            product_code: this.config.productCode,
            success_url: this.config.successUrl,
            failure_url: this.config.failureUrl,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature
        };
        const paymentConfig = {
            url: this.baseUrl,
            data: payload,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            responseHandler: (response: AxiosResponse) => response.request?.res?.responseUrl,
        }

        // Make payment request
        const paymentReq = await axios.post(String(paymentConfig.url), paymentConfig.data, {
            headers: paymentConfig.headers,
        });

        const paymentUrl = paymentConfig.responseHandler(paymentReq);
        if(!paymentUrl) {
            throw new Error("Failed to get payment URL");
        }
        return paymentUrl;
    }

    async verifyPayment(data: string){
        const decodedData = Buffer.from(data, 'base64').toString('utf-8');
        const parsed = JSON.parse(decodedData) as VerifyResponse;
        return parsed;
    }

    async getTransactionStatus(transaction_uuid: string, total_amount: string): Promise<StatusResponse> {
        const url = `${this.statusUrl}?product_code=${this.config.productCode}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;
        const { data } = await axios.get<StatusResponse>(url);
        return data;
    }
}
