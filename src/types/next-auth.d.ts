import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      userToken: string;
      image: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string
    name: string
    email: string
    role: string
    userToken: string
    image: string
  }
}
