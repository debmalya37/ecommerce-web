import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import User, { IUser } from "@/models/userModel"; // Import IUser type
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any>{
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials?.email }) as IUser;
          if (!user) throw new Error("User not found");
          if (!credentials?.password) throw new Error("Password is required");
        if (!user) throw new Error("User not found");
        if (!credentials?.password) throw new Error("Password is required");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return user; // Return entire user object
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // const typedUser = user as unknown as IUser; // Explicitly cast user to unknown and then to IUser

        token._id = user._id.toString();
        token.fullName = user.fullName;
        token.email = user.email;
        token.phone = user.phone;
        token.country = user.country;
        token.state = user.state;
        token.pincode = user.pincode;
        token.address = user.address;
        token.wallet = {
          balance: user.wallet?.balance ?? 0,
          coins: user.wallet?.coins ?? 0,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.fullName = token.fullName;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.country = token.country;
      session.user.state = token.state;
      session.user.pincode = token.pincode;
      session.user.address = token.address;
      session.user.wallet = token.wallet;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
