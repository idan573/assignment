import { Auth0Client } from '@auth0/auth0-spa-js';
/* Utils */
import { isFacebookApp } from 'core/utils';
import { history } from 'App/components/App';

/* Services */
import { graphqlService } from 'services/graphqlService';

const SCALEZ_CLAIMS: string = 'https://savvy.style/scalez_id';

const client_id =
  ENV === ENVIRONMENTS.PROD
    ? '31YuWGvGO1whJmQCP1ye5PeiprLGsBJs'
    : '06r5ZU9Y2wzy1qBiktQhufgsCR0rypKg';

const domain =
  ENV === ENVIRONMENTS.PROD
    ? 'scalez.us.auth0.com'
    : 'scalez-stage.us.auth0.com';

class AuthService {
  private token: string = null;
  private provider: string = 'openid';
  private userId: string;
  private appAuth0?: Auth0Client;

  constructor() {
    this.appAuth0 = new Auth0Client({
      domain,
      client_id,
      responseType: 'token id_token',
      cacheLocation: 'localstorage'
    });
  }

  public setProvider(provider: string) {
    this.provider = provider;
  }

  public async getUserId() {
    if (this.userId) {
      return this.userId;
    }

    const claims = await this.appAuth0.getIdTokenClaims();

    const userId = claims ? claims[SCALEZ_CLAIMS] : null;

    return userId;
  }

  public async logout() {
    await this.appAuth0.logout({ returnTo: 'https://show.savvy.style' });
  }

  public async login() {
    await this.appAuth0.loginWithRedirect({
      redirect_uri: `${
        window.location.origin
      }/authorized?qs=${encodeURIComponent(
        window.location.search
      )}&page=${encodeURIComponent(window.location.pathname)}`
    });
  }

  private async verifyAuthenticationFromProviderAuth0() {
    await this.appAuth0.handleRedirectCallback();
    try {
      await this.appAuth0.getTokenSilently();
      await this.getToken();
      return Promise.resolve(this.token);
    } catch (loginError) {
      return Promise.reject();
    }
  }

  public async getToken() {
    const claims = await this.appAuth0.getIdTokenClaims();

    this.token = claims['__raw'];
    return this.token;
  }

  public async verifyAuthenticationFromProviderRedirect(
    searchParams: URLSearchParams
  ): Promise<() => void> {
    const isAuth0 = searchParams.get('code');

    if (!isAuth0) {
      return;
    }

    const token = await this.verifyAuthenticationFromProviderAuth0().catch(
      err => this.login()
    );

    return () => this.redirectToActualPage(searchParams);
  }

  private redirectToActualPage(searchParams: URLSearchParams) {
    const qs = searchParams.get('qs');
    const pathname = searchParams.get('page');
    const redirectSearchParams = new URLSearchParams(qs);
    redirectSearchParams.delete('channel');

    if(pathname.includes('auth')){
      history.push({pathname: '/', search: redirectSearchParams.toString()})
      return;
    }

    history.push({
      pathname: pathname || '/',
      search: redirectSearchParams.toString()
    });
  }

  public async isAuthenticated() {
    if (isFacebookApp()) {
      return true;
    }

    try {
      if (this.token) {
        // console.log('AuthService is authenticated: Token Exist');
        return true;
      }

      await this.appAuth0.getTokenSilently();
      await this.getToken();

      const isAuthenticated = await this.appAuth0.isAuthenticated();
      // console.log('AuthService is authenticated: isAuth =', isAuthenticated);
      return isAuthenticated;
    } catch (error) {
      // console.log(
      //   'AuthService is NOT authenticated: user might not be connected',
      //   error
      // );

      return false;
    }
  }
}

export const authService = new AuthService();
