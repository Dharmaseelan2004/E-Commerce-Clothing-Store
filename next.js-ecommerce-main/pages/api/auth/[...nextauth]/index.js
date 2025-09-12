import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await db.connect();
        const user = await User.findOne({ email: credentials.email });
        await db.disconnect();

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});
