/* Core */
import {
  getCookie,
  delay,
  isFacebookApp,
  isMobileApp,
  getPlatform
} from 'core/utils';

/* Services */
import { graphqlService } from 'services/graphqlService';
import { authService } from 'services/authService';

/* Api */
import { getUserQuery, GQLGetUserVars } from 'App/api/user/getUser';
import { updateUserMutation, GQLUpdateUserVars } from 'App/api/user/updateUser';

/* Types */
import { User } from 'App/types';

/* Routes */
import {
  styleUpsFlowRoutes,
  taskResultFlowRoutes,
  paymentFlowRoutes,
  standaloneFlowRoutes
} from 'App/components/routerConfig';
import LogRocket from 'logrocket';
import { analyticsService } from './analyticsService';
import { oneSignalService } from './oneSignalService';
import ReactPixel, { AdvancedMatching } from 'react-facebook-pixel';

class AppInitializationService {
  private isInitializationReady: boolean = false;
  private userData: User = {} as User;

  public getUserData(): User {
    return this.userData;
  }

  public checkInitializationReady(): boolean {
    return this.isInitializationReady;
  }

  private async queryUser(vars: GQLGetUserVars) {
    this.userData = await getUserQuery(vars);
  }

  private async updateUserPlatform() {
    if (!!this.userData?.userId) {
      await updateUserMutation({
        userId: this.userData.userId,
        attributes: {
          currentPlatform: getPlatform()
        }
      });
    }
  }

  private async handleAuthenticated() {
    const userId = await authService.getUserId();
    const token = await authService.getToken();

    graphqlService.configureSecure(token);

    await this.queryUser({ userId, isAddUploadImages: true });
  }

  private async handleNonAuthenticated() {
    const currentRoute = [
      ...styleUpsFlowRoutes,
      ...taskResultFlowRoutes,
      ...paymentFlowRoutes,
      ...standaloneFlowRoutes
    ].find(route => {
      const routePathWithoutParams = route.pathname.split('/:')[0];

      return window.location.pathname.includes(routePathWithoutParams);
    });

    const isCurrentRoutePrivate = !!currentRoute?.restricted;

    if (isCurrentRoutePrivate) {
      await authService.login();
      return;
    }

    graphqlService.configurePublic('publicuser');
  }

  private async webInit() {
    const isAuthenticated = await authService.isAuthenticated();

    authService.setProvider('auth0');

    if (isAuthenticated) {
      await this.handleAuthenticated();
    } else {
      await this.handleNonAuthenticated();
    }
  }

  private async facebookInit() {
    console.log('started facebook init');

    authService.setProvider('facebook');

    const paramsUserId =
      new URLSearchParams(window.location.search).get('userId') ||
      getCookie('userId');

    console.log(`facebook flow with user id: ${paramsUserId}`);

    if (!!paramsUserId) {
      graphqlService.configurePublic(paramsUserId);

      await this.queryUser({ userId: paramsUserId });

      console.log(`finished facebook login for: ${paramsUserId}`);
    } else {
      await authService.login();
    }
  }

  private async initializeAppAnalytics(userData: User) {
    await delay(250);
    if (!!window.onesignal_info) {
      const playerId = window.onesignal_info.oneSignalUserId;
      if (playerId) {
        oneSignalService.setExternalUserId(playerId, userData?.email);
        await updateUserMutation({
          userId: this.userData.userId,
          attributes: {
            oneSignalId: playerId
          }
        });
      }
      analyticsService.identify({
        userId: userData?.userId,
        traits: {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.email,
          phoneNumber: userData?.phoneNumber,
          playerId,
          phone: userData?.phoneNumber
        }
      });
    }
  }

  private async analyticsInit() {
    const userData = this.userData;

    if (userData?.userId) {
      try {
        console.log(
          `configure analytics for userId: ${userData?.userId ??
            'public user'} name: ${userData?.firstName} email: ${
            userData?.email
          }`
        );
        
        if(ENV == ENVIRONMENTS.PROD){
          console.log(
            `configuring facebook analytics
            }`
          );
          //@ts-ignore
          const advacenMatching: AdvancedMatching = {
            em: userData?.email,
            fn: userData?.firstName,
            ln: userData?.lastName,
            ph: userData?.phoneNumber ? userData?.phoneNumber?.replace('+','') : null,
            //@ts-ignore
            external_id: userData?.userId
          }
          ReactPixel.init('147331369256129', advacenMatching);
          ReactPixel.pageView();
        }
        

        window?.hj?.('identify', userData?.userId, {
          Email: userData?.email ?? '',
          Phone: userData?.phoneNumber ?? '',
          'First name': userData?.firstName ?? '',
          'Last Name': userData?.lastName ?? ''
        });

        window?._cio?.identify({
          id: userData?.userId
        });

        if (userData?.email) {
          console.log(`Autopilot.run email=${userData?.email}`);
          window?.Autopilot?.run('associate', {
            Email: userData?.email
          });
        }

        LogRocket.identify(userData?.userId ?? 'public user', {
          name: userData?.firstName,
          email: userData?.email,

          // Add your own custom user variables here, ie:
          subscriptionType: userData?.userId
        });

        if (isMobileApp()) {
          await this.initializeAppAnalytics(userData);
          return;
        }

        analyticsService.identify({
          userId: userData?.userId,
          traits: {
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            email: userData?.email,
            phoneNumber: userData?.phoneNumber,
            phone: userData?.phoneNumber
          }
        });
        /*
        const cio = (window as any)._cio;
        cio.identify({
          first_name: userData?.firstName,
          created_at: userData?.createdAt,
          last_name: userData?.lastName,
          email: userData?.email,
          phoneNumber: userData?.phoneNumber
        });*/
      } catch (e) {
        console.log(e);
      }
    }
  }

  public async appInit() {
    console.log('initializing app');

    try {
      const isFB = isFacebookApp();

      if (isFB) {
        await this.facebookInit();
      } else {
        await this.webInit();
      }

      await this.updateUserPlatform();

      await this.analyticsInit();
      this.isInitializationReady = true;
      console.log('app initialized successfully');
    } catch (e) {
      console.error('App is not initialized: ', e);
      this.isInitializationReady = false;
    }
  }
}

export const appInitializationService = new AppInitializationService();
