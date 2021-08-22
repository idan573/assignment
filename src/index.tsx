import * as React from 'react';
import ReactDOM from 'react-dom';
import { Normalize } from 'styled-normalize';
import Amplify from '@aws-amplify/core';
import { CssMain } from '@bit/scalez.savvy-ui.css-main';
import * as Sentry from '@sentry/browser';
import LogRocket from 'logrocket';
import TopBarProgress from 'react-topbar-progress-indicator';

/* Api */
import { analyticsService } from 'services/analyticsService';

/* Components */
import App from 'App/components/App';
import { SentryErrorCatcher } from 'App/components/SentryErrorCatcher/SentryErrorCatcher';

/* Styles */
import { Fonts } from 'globalstyles/Fonts';
import { CssApp } from 'globalstyles/Main';

if (ENV === ENVIRONMENTS.PROD) {
  window.Chargebee.init({
    site: 'scalezio',
    domain: 'https://scalezio.chargebee.com/',
    publishableKey: 'live_ur1473YNJ6cd8rTK72xCAjOnibH8Aayo6'
  });
} else {
  window.Chargebee.init({
    site: 'scalezio-test',
    domain: 'https://scalezio-test.chargebee.com/',
    publishableKey: 'test_AuHwBUMHQHxpiUlXQrPhVi4GOCEN8ctQ'
  });
}

TopBarProgress.config({
  barThickness: 5,
  barColors: {
    '0': 'rgb(255,230,226)',
    '1.0': 'rgb(242,191,183)'
  },
  shadowBlur: 0
});

const setVhProperty = () =>
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  );

/* Set --vh custom property */
setVhProperty();

/* Update --vh custom property on resize and on orientationchange */
['resize', 'orientationchange'].forEach(event =>
  window.addEventListener(event, setVhProperty, false)
);

if (ENV === ENVIRONMENTS.PROD) {
  /* Error catching, Analytics and Tracking init */
  LogRocket.init('turpct/scalez');
  Sentry.init({
    dsn: 'https://060492fc0f78497596554074a80437b5@sentry.io/5190292'
  });
  analyticsService.load({
    writekey: 'dG3eco0ULc20vLEbvoExSAFCOaCBuZtq'
  });
} else {
  analyticsService.load({ writekey: 'em8BAguca6mMbpU4u4VEHRd3PAQdFmUD' });
}

const Root: React.FC = () => (
  <>
    <Normalize />
    <Fonts />
    <CssMain />
    <CssApp />

    <SentryErrorCatcher>
      <App />
    </SentryErrorCatcher>
  </>
);

ReactDOM.render(<Root />, document.getElementById('root'));
