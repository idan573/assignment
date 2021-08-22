declare const enum ENVIRONMENTS {
  OPERATIONS = 'operations',
  DEV = 'development',
  STAGE = 'stage',
  DEMO = 'demo',
  PROD = 'production'
}

declare const ENV: ENVIRONMENTS;

declare const enum REQUEST_STATUSES {
  NONE = 'NONE',
  REQUEST = 'REQUEST',
  GOT = 'GOT',
  ERROR = 'ERROR'
}

declare module '*.woff';
declare module '*.woff2';
declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.gif';
declare module '*.mp4';

declare interface Window {
  analytics: SegmentAnalytics.AnalyticsJS;
  Chargebee: any;
  Autopilot: any;
  onesignal_info: any;
  Intercom: any;
  hj: any;
  _cio: any;
  webkit: any;
  appInterface: any;

}
