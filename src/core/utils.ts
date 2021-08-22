import { LazyExoticComponent, ComponentType, lazy } from 'react';

export const scrollTop = (selector: string = '#root') => {
  const htmlNode = document.querySelector(selector);

  if (htmlNode.scrollTop > 0) {
    htmlNode.scrollTop = 0;
  }
};

export const getPartialFragment = (
  fragment: string = '',
  keys: string[] = []
): string => {
  const allProperties = fragment.replace(/(\n|{|})/g, '');

  const partialFragment = keys.reduce((acc, prop) => {
    const regex = new RegExp(` ${prop} `, 'g');
    return `${acc} ${allProperties.match(regex)?.[0] ?? ''}`;
  }, '');

  return `{ ${partialFragment} }`;
};

export const delayWithCleanup = async (timeout, ms: number) =>
  new Promise(resolve => (timeout = setTimeout(resolve, ms))).finally(() =>
    clearTimeout(timeout)
  );

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const setUserIdCookie = (userId: string) => {
  const domainEnv = {
    [ENVIRONMENTS.DEV]: 'dev',
    [ENVIRONMENTS.STAGE]: 'stage',
    [ENVIRONMENTS.PROD]: ''
  }[ENV];

  /* Save userId (FB messenger redirect case) */
  document.cookie = `userId=${userId};path=/homepage;domain=${
    !!domainEnv ? domainEnv + '-' : ''
  }show.savvy.style`;
};

export const getCookie = (cname: string): string => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

/* Flow routes */

export const lazyLoadFlowBuilderRoute = (
  stepName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`FlowBuilder/features/${stepName}/components/${stepName}`)
    );

    return component;
  } catch (e) {
    console.error(`${stepName} load error`, e);
  }
};

export const lazyLoadStylistOverviewStep = (
  stepName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`FlowBuilder/features/StylistOverviewStep/components/${stepName}`)
    );

    return component;
  } catch (e) {
    console.error(`${stepName} load error`, e);
  }
};

export const lazyLoadCreateProfileStep = (
  stepName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`FlowBuilder/features/CreateProfileStep/components/${stepName}`)
    );

    return component;
  } catch (e) {
    console.error(`${stepName} load error`, e);
  }
};

/* App routes */

export const lazyLoadFeature = (
  featureName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`features/${featureName}/components/${featureName}`)
    );

    return component;
  } catch (e) {
    console.error(`${featureName} load error`, e);
  }
};

export const lazyLoadChatRoute = (
  pageName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`features/ChatPage/components/${pageName}`)
    );

    return component;
  } catch (e) {
    console.error(`${pageName} load error`, e);
  }
};

export const lazyLoadStylistOverviewRoute = (
  pageName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`features/StylistOverviewPage/components/${pageName}`)
    );

    return component;
  } catch (e) {
    console.error(`${pageName} load error`, e);
  }
};

export const lazyLoadFeatureRoute = (
  flowName: string,
  pageName: string
): LazyExoticComponent<ComponentType> => {
  try {
    const component = lazy(() =>
      import(`features/${flowName}/components/${pageName}/${pageName}`)
    );

    return component;
  } catch (e) {
    console.error(`${flowName} ${pageName} load error`, e);
  }
};

export const openAppStore = () => {
  const googlePlayLink =
    'https://play.google.com/store/apps/details?id=style.savvy';
  const appStoreLink =
    'https://apps.apple.com/us/app/style-me-savvy/id1524349119?mt=8';

  const userAgent = navigator?.userAgent?.toLowerCase();

  if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
    window.open(appStoreLink, '_self');
  } else {
    // userAgent.indexOf('android') > -1
    /* Open android link as default */
    window.open(googlePlayLink, '_self');
  }
};

export const openStylistPlatform = (userId?: string) => {
  const domainEnv = {
    [ENVIRONMENTS.DEV]: 'dev',
    [ENVIRONMENTS.STAGE]: 'stage',
    [ENVIRONMENTS.PROD]: ''
  }[ENV];

  if (!!userId) {
    setUserIdCookie(userId);
  }

  window.open(
    `https://${!!domainEnv ? domainEnv + '-' : ''}app.savvy.style`,
    '_self'
  );
};

export const openFAQ = () => window.open('https://savvy.style/help', '_self');

export const isFacebookApp = (): boolean => {
  // @ts-ignore
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.indexOf('FBAN') > -1 ||
    ua.indexOf('FBAV') > -1 ||
    ua?.includes('FBSN') ||
    ua?.includes('FBIV')
  );
};

export const isMobileApp = (): boolean => {
  return navigator.userAgent.indexOf('gonative') > -1;
};

export const getPlatform = (): string => {
  return isMobileApp() ? 'mobile' : isFacebookApp() ? 'messenger' : 'web';
};

export const generateRandomId = (): string => {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export const getSavvyStylistId = (): string => {
  if (ENV === ENVIRONMENTS.DEV) {
    return 'a962aa74-a214-46d9-9004-a90c4eaadaaa';
  }

  if (ENV === ENVIRONMENTS.STAGE) {
    return '11c1bdfb-62d4-42b8-bbca-c2d03c485745';
  }

  if (ENV === ENVIRONMENTS.PROD) {
    return 'e0b756c6-9f7c-4064-80a3-b9416e86c77b';
  }
};
