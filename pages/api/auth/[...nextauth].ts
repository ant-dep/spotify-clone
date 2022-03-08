
import NextAuth from 'next-auth';
import {JWT} from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';

import spotifyApi, {LOGIN_URL} from '../../../lib/spotify';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {

  try {
    spotifyApi.setAccessToken(token.accessToken as string);
    spotifyApi.setRefreshToken(token.refreshToken as string);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
    // {
    //   access_token: 'BQCzLdmjr-JSnm5YpxKkyVaRRAM31lJnEeg0sA48G4TRC-TqFuGzW_Jj_XW-5UDD2FXOVvdHkv7XeJAT6XNbQUuuaWuuCzeODISWFp7Os5hZIcrN268vV6scOmYAKfzX0_pCWI9o1YqU3QSis1UVLIETDJ-dcXIk_-Si4GYD51ZzwrsCvvYn-sZFRYRMVLgwU_haWM32dVmgrPS5OYZMUdN2CYjYuryU',
    //   token_type: 'Bearer',
    //   expires_in: 3600,
    //   scope: 'playlist-read-private playlist-read-collaborative streaming user-modify-playback-state user-library-read user-follow-read user-read-playback-state user-read-currently-playing user-read-email user-read-recently-played user-read-private user-top-read'
    // }

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // https://next-auth.js.org/tutorials/refresh-token-rotation
    async jwt({token, account, user}) {


      // CASE1: initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000, // milliseconds
        };
      }

      // CASE2: Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as Number)) {
        return token;
      }

      // CASE3: Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({session, token}) {

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.username = token.username;
      return session;
    },
  },
});