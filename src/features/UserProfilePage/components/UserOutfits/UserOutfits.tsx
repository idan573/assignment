import * as React from 'react';
import { useHistory } from 'react-router';
import concat from 'ramda/src/concat';
import mergeDeepWithKey from 'ramda/src/mergeDeepWithKey';
import { Button } from '@bit/scalez.savvy-ui.button';
import { useLazyRequest, REQUEST_STATUSES } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  GQLScrollOutfitsVars,
  ScrollOutfitsData,
  scrollOutfitsQuery
} from 'App/api/outfit/scrollOutfits';

/* Components */
import { RootContextType, RootContext } from 'App/components';
import { OutfitsList } from 'Layouts/OutfitsList/OutfitsList';

/* Styles */
import {
  StyledPlaceholderImage,
  StyledEmptyOutfitsList,
  StyledOutfitsListHeader
} from './styles';

type Props = GQLScrollOutfitsVars;

const listConfig = {
  /* Header height + top contect height */
  screenContentHeight:
    +getComputedStyle(document.documentElement)
      .getPropertyValue('--headerHeight')
      .replace('px', '') + 128
};

const defaultVariables = {
  numberOfOutfits: 20,
  lastDaysAmount: 365,
  isUserOutfits: true,
  isFilterUserId: false
};

const UserOutfits: React.FC<Props> = React.memo(
  ({ ...variables }: Props = {}) => {
    const history = useHistory();

    const {
      state: { userData }
    } = React.useContext<RootContextType>(RootContext);

    const [
      getOutfits,
      { data: scrollOutfits = {}, loading: loadingOutfits }
    ] = useLazyRequest<GQLScrollOutfitsVars, ScrollOutfitsData>(
      scrollOutfitsQuery,
      {
        initialState: {
          loading: true,
          data: {
            outfits: []
          }
        },
        immediate: true,
        payload: {
          userId: userData.userId,
          ...defaultVariables,
          ...variables
        },
        mergeResponse(oldState, newState) {
          return mergeDeepWithKey(
            (k, l, r) => (k === 'outfits' ? concat(l, r) : r),
            oldState,
            newState
          );
        }
      }
    );

    const handleLoadMore = React.useCallback(() => {
      getOutfits({
        scrollId: scrollOutfits.scrollId,
        userId: userData.userId,
        ...defaultVariables,
        ...variables
      });
    }, [scrollOutfits]);

    return (
      <>
        {(!loadingOutfits || !!scrollOutfits?.outfits?.length) && (
          <OutfitsList outfits={scrollOutfits.outfits} listConfig={listConfig}>
            <StyledOutfitsListHeader>
              <h3>Styled for Me</h3>

              <Button
                data-size="big"
                data-form="circle"
                data-type="secondary"
                data-action="plus"
                data-action-position="center"
                onClick={() => {
                  history.push({
                    pathname: '/homepage',
                    state: {
                      activeTabIndex: 1
                    }
                  });
                }}
              />
            </StyledOutfitsListHeader>

            {!scrollOutfits?.outfits?.length && (
              <StyledEmptyOutfitsList>
                <p className="body">
                  No outfits yet. <br />
                  Once you style outfits they will show up here.
                </p>

                <StyledPlaceholderImage />
              </StyledEmptyOutfitsList>
            )}
          </OutfitsList>
        )}
      </>
    );
  }
);

export { UserOutfits };
