import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from '@bit/scalez.savvy-ui.button';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { NotFound } from '@bit/scalez.savvy-ui.not-found';

/* Analytics */
import { analyticsService } from 'services/analyticsService';

/* Api */
import { getStylistInfo } from '../api';

/* Reducers */
import {
  RequestDataType,
  ResponseDataType,
  GetStylistState,
  getStylistReducer,
  getStylistReducerInitialState
} from '../reducers';

/* Styles */
import { StyledStylistPage, StyledStylistImage } from './styles';

type Props = RouteComponentProps<{
  userName: string;
}>;

const StylistPage: React.FC<Props> = ({ match }: Props) => {
  const [getStylistState, dispatch] = React.useReducer(
    getStylistReducer,
    getStylistReducerInitialState
  );

  React.useEffect(() => {
    console.log(getStylistState);
  }, [getStylistState]);

  React.useEffect(() => {
    analyticsService.page({ name: 'StylistLandingPage' });
    handleApiRequest();
  }, []);

  const handleApiRequest = React.useCallback(async () => {
    dispatch({
      status: REQUEST_STATUSES.REQUEST
    });

    try {
      const stylist: ResponseDataType = await getStylistInfo(match.params);

      const actionData =
        !!stylist && Object.keys(stylist).length
          ? {
              status: REQUEST_STATUSES.GOT,
              data: stylist
            }
          : {
              status: REQUEST_STATUSES.ERROR,
              error: `${match.params.userName} user does not exist`
            };

      dispatch(actionData);
    } catch (e) {
      console.error(e);

      dispatch({
        status: REQUEST_STATUSES.ERROR,
        error: e.message
      });

      /* Catch network errors in Sentry */

      if (ENV === ENVIRONMENTS.STAGE || ENV === ENVIRONMENTS.PROD) {
        Sentry.withScope(scope => {
          scope.setTag('ENV', ENV);
          scope.setTag('userName', match.params.userName);
          Sentry.captureException(e);
        });
      }
    }
  }, []);

  const handleMessengerRedirect = React.useCallback(() => {
    analyticsService.track({
      event: 'StylistLandingPageOpenedChat',
      properties: {
        component: 'StylistLandingPage',
        chat: 'messenger',
        stylistUserName: match.params.userName,
        stylistId: getStylistState.data.stylistId,
        stylistFirstName: getStylistState.data.firstName,
        stylistLastName: getStylistState.data.lastName
      },
      callback: () => {
        window.location.href =
          ENV === ENVIRONMENTS.PROD
            ? `https://m.me/StyleMeSavvy?ref=w12600099--${match.params.userName}`
            : `https://m.me/StyleMeSavvy?ref=w12598607--${match.params.userName}`;
      }
    });
  }, [getStylistState]);

  return (
    <>
      <Loader render={getStylistState.status === REQUEST_STATUSES.REQUEST} />

      {getStylistState.status === REQUEST_STATUSES.ERROR && <NotFound />}

      {getStylistState.status === REQUEST_STATUSES.GOT && (
        <StyledStylistPage>
          <StyledStylistImage src={getStylistState.data.profilePicture} />
          <h3>{match.params.userName}</h3>

          <hr />

          <h4>How to get styled by me:</h4>

          <ol>
            <li>
              <p className="sbody">
                My smart assistant Savvy is going to ask you a few questions
                (over Messenger)
              </p>
            </li>
            <li>
              <p className="sbody">
                I will personally style a full outfit for you
              </p>
            </li>
            <li>
              <p className="sbody">You'll receive my styling advice</p>
            </li>
          </ol>

          <Button data-type="messenger" onClick={handleMessengerRedirect}>
            Get Styled over Messenger
          </Button>
        </StyledStylistPage>
      )}
    </>
  );
};

export default StylistPage;
