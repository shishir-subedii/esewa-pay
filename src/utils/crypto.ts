import crypto from "crypto";

export function generateHmacSha256(data: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(data).digest("base64");
}
