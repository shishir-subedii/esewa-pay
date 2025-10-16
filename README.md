# 💰 eSewa Pay SDK (TypeScript)

A modern **TypeScript SDK** for integrating **eSewa Payment Gateway** into your Node.js or TypeScript backend applications.  
Supports **both ESM and CommonJS** environments.

---

## 📸 Transaction Flow

The payment process follows this official eSewa flow:

![eSewa Transaction Flow](https://cdn.esewa.com.np/merchant/devdocs/images/system_interaction-02.jpg)

🔗 **Official Docs:** [https://developer.esewa.com.np/pages/Epay#transactionflow](https://developer.esewa.com.np/pages/Epay#transactionflow)

---

## ⚙️ Installation

```bash
npm install esewa-pay
```

--- 
## 🧠 Overview

This SDK helps you:

Initiate payments with eSewa

Verify transactions after payment

Handle secure signature generation using HMAC (SHA256)

Support both development and production environments

Integrate webhooks for payment success/failure

---

## Usage
## Import the SDK

ESM (TypeScript / ES Modules)

```ts
import { EsewaClient } from "esewa-pay";
```

```ts
const { EsewaClient } = require("esewa-pay");
```

## Example: Initialize and Make a Payment
```ts
import { EsewaClient } from "esewa-pay";

const esewa = new EsewaClient({
  secretKey: "8gBm/:&EnhH.1/q(", // Test key (provided below)
  productCode: "EPAYTEST",
  successUrl: "https://yourserver.com/esewa/success",
  failureUrl: "https://yourserver.com/esewa/failure",
  env: "development", // or 'production'
});

// Example: initiate a payment
(async () => {
  const txn_uuid = "txn-" + Date.now();

  const payment = await esewa.initiatePayment({
    amount: "100",
    total_amount: "100",
    transaction_uuid: txn_uuid,
  });

  console.log("Redirect user to this URL:", payment.url);
})();
```

## Example: Verify a Payment
After the user pays, eSewa redirects to your success webhook URL with query parameters.
You can verify the transaction on your backend:

```ts
const response = await esewa.verifyPayment({
  amount: "100",
  product_code: "EPAYTEST",
  transaction_uuid: "txn-123456789"
});

console.log(response);
```

## Webhook Setup
Create a backend route to handle successful payments.
Example using Express.js:

```ts
import express from "express";
import { EsewaClient } from "esewa-pay";

const app = express();

const esewa = new EsewaClient({
  secretKey: "8gBm/:&EnhH.1/q(",
  productCode: "EPAYTEST",
  successUrl: "https://yourserver.com/esewa/success",
  failureUrl: "https://yourserver.com/esewa/failure",
  env: "development",
});

app.get("/esewa/success", async (req, res) => {
  try {
    const { transaction_uuid, product_code, total_amount } = req.query;

    const result = await esewa.verifyPayment({
      transaction_uuid: String(transaction_uuid),
      product_code: String(product_code),
      amount: String(total_amount),
    });

    console.log("Payment Verified:", result);
    res.send("Payment verified successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## Environments
🧪 Development (Testing)

Use the following test credentials to simulate payments.

Field	Value
eSewa ID	9806800001 / 9806800002 / 9806800003 / 9806800004 / 9806800005
Password	Nepal@123
MPIN	1122
Merchant ID / Service Code	EPAYTEST
Token	123456
Secret Key (for ePay v2)	8gBm/:&EnhH.1/q(

👉 Use env: "development" in your client initialization.

---
## 💼 Production
After successful test transactions, eSewa will provide your live merchant credentials and secret key.

Set:
```ts
env: "production"
```

The SDK automatically switches between:

https://uat.esewa.com.np/epay/main (Development)

https://esewa.com.np/epay/main (Production)

---
## 📄 License

MIT License
 © 2025 Shishir Subedi

---
## 🧭 Links

🔗 Official Docs: https://developer.esewa.com.np/pages/Epay#transactionflow

💬 eSewa Merchant Portal: https://esewa.com.np

🧑‍💻 Author: Shishir Subedi

---

This library is conceptually inspired by node-cache, but with a lighter footprint, singleton access, and full TypeScript typings.

---