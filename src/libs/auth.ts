// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions, User } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { email, password } = credentials as { email: string; password: string }

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          console.log('Social Login:: ', data);

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */

            const final_data:User = {
                "id": data.data.id,
                "name": data.data.first_name+' '+data.data.last_name,
                "email": email,
                "image": data.data.profile_picture??"/images/avatars/1.png",
                "userToken": data.data.token,
                "role": data.data.role,
                "ambassador_status": data.data.ambassador_status,
                "membership_level": data.data.membership_level,
                "access_uid": data.data.access_uid,
            }

            return final_data //data
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    }),

    FacebookProvider({
      clientId: "787333829348117",
      clientSecret: "a2ac658512f1302e093adc4d9b79eb0f",
    }),

    GoogleProvider({
      clientId: "899760202984-plt5aioi3p8ctsr3tvroku9v9hm4ad25.apps.googleusercontent.com",
      clientSecret: "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"
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  secret: process.env.NEXTAUTH_SECRET,

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.user_id = user.id
        token.name  = user.name
        token.email = user.email
        token.token = user.userToken
        token.image = user.image??"/images/avatars/1.png"
        token.role  = user.role
        token.ambassador_status  = user.ambassador_status
        token.membership_level   = user.membership_level
        token.access_uid   = user.access_uid
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.id     = token?.user_id as string
        session.user.name   = token?.name as string
        session.user.email  = token?.email as string
        session.user.role   = token?.role as string
        session.user.image  = token?.image as string
        session.user.userToken  = token?.token as string
        session.user.ambassador_status  = token?.ambassador_status as number
        session.user.membership_level   = token?.membership_level as number
        session.user.access_uid   = token?.access_uid as string
      }

      return session
    }
  }
}
