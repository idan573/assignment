import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { UnexpectedErrorBlock } from '@bit/scalez.savvy-ui.unexpected-error-block';
import { NewVersionErrorBlock } from '@bit/scalez.savvy-ui.new-version-error-block';

/* Components */
import { history } from 'App/components/App';

/* Styles */
import {
  StyledSentryErrorCatcher,
  StyledTitle,
  StyledDescription
} from './styles';

interface Props {
  children: string | JSX.Element | (string | JSX.Element)[];
}

interface State {
  error: any;
}

class SentryErrorCatcher extends React.Component<Props, State> {
  state = {
    error: null
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error });

    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      scope.setTag('ENV', ENV);
      Sentry.captureException(error);
    });
  }

  goToHomepage = () => {
    this.setState(
      {
        error: null
      },
      () =>
        history.push({
          pathname: '/homepage',
          search: location.search
        })
    );
  };

  windowReload = () => {
    this.setState(
      {
        error: null
      },
      () => window.location.reload()
    );
  };

  render() {
    return this.state.error ? (
      this.state.error?.message?.toLowerCase()?.includes('chunk') ? (
        /* ChunkLoad error */
        <NewVersionErrorBlock onClick={this.windowReload} />
      ) : (
        /* Any runtime error */
        <UnexpectedErrorBlock onClick={this.goToHomepage} />
      )
    ) : (
      /* when there's not an error, render children untouched */
      this.props.children
    );
  }
}

export { SentryErrorCatcher };
