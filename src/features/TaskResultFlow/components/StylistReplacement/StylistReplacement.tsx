import * as React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { RouteComponentProps } from 'react-router-dom';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Api */
import { GQLGetStylistVars, getStylistQuery } from 'App/api/stylist/getStylist';

/* Types */
import { Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledStylistReplacementPage,
  StyledStylistImage,
  StyledButtonsBlock
} from './styles';

type Props = RouteComponentProps<{
  taskId: string;
}>;

const StylistReplacement: React.FC<Props> = React.memo(
  ({ match, history, location }: Props) => {
    const {
      state: { activeTaskResultData },
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    const { loading: loadingStylist, data: stylistData } = useRequest<
      GQLGetStylistVars,
      Stylist
    >(getStylistQuery, {
      payload: {
        stylistId: activeTaskResultData?.stylist?.stylistId
      }
    });

    React.useEffect(() => {
      trackPage({
        name: 'StylistReplacementPage'
      });
    }, []);

    const handleChooseOtherStylist = React.useCallback(() => {
      history.push({
        pathname: `/stylist-list/${activeTaskResultData.taskId}`,
        search: location.search
      });
    }, []);

    const handleChooseCurrentStylist = React.useCallback(() => {
      /* waiting for logic from the BE
      if (!!activeTaskResultData?.nextTask) {
        history.push({
          pathname: `/task-result/suggestions/${match.params.taskId}`,
          search: location.search
        });

        return;
      }*/

      history.push({
        pathname: '/homepage',
        search: location.search
      });
    }, []);

    return (
      <>
        {loadingStylist ? (
          <TopBarProgress />
        ) : !!stylistData ? (
          <>
            <StyledStylistReplacementPage>
              <StyledStylistImage src={stylistData?.profilePicture} />
              <h3>
                Would you like to continue styling with {stylistData?.firstName}
                ?
              </h3>
            </StyledStylistReplacementPage>

            <FloatWrapper position="bottom" transition="slide-bottom">
              <StyledButtonsBlock>
                <Button
                  data-type="secondary"
                  onClick={handleChooseOtherStylist}
                >
                  Switch
                </Button>
                <Button
                  data-type="primary"
                  onClick={handleChooseCurrentStylist}
                >
                  Continue
                </Button>
              </StyledButtonsBlock>
            </FloatWrapper>
          </>
        ) : (
          undefined
        )}
      </>
    );
  }
);

export default StylistReplacement;
