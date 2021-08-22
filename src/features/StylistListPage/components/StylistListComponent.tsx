import * as React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  GQLSearchStylistsVars,
  searchStylistsQuery
} from 'App/api/stylist/searchStylists';

/* Types */
import { STYLIST_TIER, Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistList } from './StylistList/StylistList';

/* Styles */
import { StyledStylistListComponent } from './styles';

export interface Props {
  variables?: Partial<GQLSearchStylistsVars>;
  onStylistClick?: (stylist: Stylist) => void;
  onStylistGot?: (stylists: Stylist[]) => void;
}

const StylistListComponent: React.FC<Props> = React.memo(
  ({ variables = {}, onStylistClick, onStylistGot }: Props) => {
    const {
      state: { userData }
    } = React.useContext<RootContextType>(RootContext);

    const { loading: loadingStylists, data: stylists } = useRequest<
      GQLSearchStylistsVars,
      Stylist[]
    >(searchStylistsQuery, {
      payload: {
        userId: userData.userId,
        limit: 12,
        ...variables,
        stylistsTiers: [STYLIST_TIER.WHITE_LABEL],
        isAddFeedback: true
      },
      onCompleted: stylists => onStylistGot?.(stylists)
    });

    const handleStylistClick = React.useCallback((stylist: Stylist) => {
      onStylistClick?.(stylist);
    }, []);

    return (
      <>
        {loadingStylists ? (
          <TopBarProgress />
        ) : !!stylists ? (
          <StyledStylistListComponent>
            <p className="sbody">
              Here are the top {stylists?.length ?? ''} stylists you matched
              with!
            </p>

            <StylistList items={stylists} onClick={handleStylistClick} />
          </StyledStylistListComponent>
        ) : (
          undefined
        )}
      </>
    );
  }
);

export { StylistListComponent };
