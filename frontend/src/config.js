const settings = {
  AUTH0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENTID,
    redirectUri: `${window.location.origin}`,
    audience: process.env.AUTH0_AUDIENCE
  },
  REALM: {
    appId: process.env.REALM_APP_ID
  }
}

export default settings;