export const environment = {
  production: true,
  supabase: {
    url: '_SUPAURL_',
    anonKey: '_SUPAANONKEY_',
  },
  auth0: {
    domain: '_AUTHDOMAIN_',
    clientId: '_CLIENTID_',
    authorizationParams: {
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      audience: '', // Add your API audience if needed
      scope: 'openid profile email',
    },
  },
};
