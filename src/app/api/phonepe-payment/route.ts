import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sha256 from "crypto-js/sha256";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { amount, userDetails } = await request.json();
    const transactionid = "Tr-"+uuidv4().toString().slice(-6);
    // Payload for PhonePe API
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: `${transactionid}`,
      merchantUserId: 'MUID-'+uuidv4().toString().slice(-6),
      amount: Math.round(amount * 100), // Convert to paisa
      redirectUrl: `http://localhost:3000/api/status/${transactionid}`,
        redirectMode: "POST",
        callbackUrl: `http://localhost:3000/api/status/${transactionid}`,
      mobileNumber: userDetails.phone,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const dataPayload = JSON.stringify(payload);
      console.log(dataPayload);

      const dataBase64 = Buffer.from(dataPayload).toString("base64");
      console.log(dataBase64);

      const fullURL =
        dataBase64 + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
     const dataSha256 = sha256(fullURL);

      const checksum = dataSha256 + "###" + process.env.PHONEPE_SALT_INDEX;
      console.log("c====",checksum);



    const UAT_PAY_API_URL =
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";


  const response = await axios.post(
    UAT_PAY_API_URL,
    {
      request: dataBase64,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
         "X-VERIFY": checksum,
      },
    }
  );


  const redirect=response.data.data.instrumentResponse.redirectInfo.url;
  console.log(redirect);
  alert(redirect);


  }

catch (error:any) {
     console.error('Payment initiation error:', error.response?.data || error.message);
      return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
    }
  }