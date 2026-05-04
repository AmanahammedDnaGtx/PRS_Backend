export type OAuthTokenPayload = {
  active: boolean;
  sub?: string;
  scope?: string;
  client_id?: string;
  username?: string;
  token_type?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  aud?: string | string[];
  iss?: string;
  [key: string]: unknown;
};
