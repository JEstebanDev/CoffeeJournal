export const environment = {
  production: true,
  auth0: {
    domain: 'dev-8ug0ksj0cil6iwit.us.auth0.com',
    clientId: 'MIxnuAIbwYtSQzoro9yEHKfq5qJU6mVp',
    authorizationParams: {
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      audience: '', // Add your API audience if needed
      scope: 'openid profile email'
    }
  }
};