import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    pincode: string;
    address: string;
    wallet: {
      balance: number;
      coins: number;
    };
  }

  interface Session {
    user: {
      _id: string;
      fullName: string;
      email: string;
      phone: string;
      country: string;
      state: string;
      pincode: string;
      address: string;
      wallet: {
        balance: number;
        coins: number;
      };
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    pincode: string;
    address: string;
    wallet: {
      balance: number;
      coins: number;
    };
  }
}
