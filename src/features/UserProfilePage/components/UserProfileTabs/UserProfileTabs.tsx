import * as React from 'react';

/* Core */
import { scrollTop } from 'core/utils';

/* Types */
import { UserAttribute } from 'App/types';

/* Components */
import { UserAnalysisEntries } from '../UserAnalysisEntries/UserAnalysisEntries';
import { UserBodyAttributes } from '../UserBodyAttributes/UserBodyAttributes';
import { UserOutfits } from '../UserOutfits/UserOutfits';

/* Styles */
import {
  StyledUserImage,
  StyledViewsControls,
  StyledSwipeableViews
} from './styles';

type Props = {
  userImages: string[];
  bodyAttributes: UserAttribute[];
  styleAttributes: UserAttribute[];
  demographyAttributes: UserAttribute[];
};

const maxWidth =
  +getComputedStyle(document.documentElement)
    .getPropertyValue('--maxWidth')
    .replace('px', '') || 500;

const width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth;

const UserProfileTabs: React.FC<Props> = React.memo(
  ({
    userImages = [],
    bodyAttributes = [],
    styleAttributes = [],
    demographyAttributes = []
  }: Props) => {
    const rootNode: HTMLDivElement = React.useMemo(
      () => document.querySelector('[class*="StyledSlidePageWrapper"]'),
      []
    );

    React.useEffect(() => {
      /* Clean up overflow: hidden on unmount */
      return () => {
        if (rootNode.style.overflowY === 'hidden') {
          rootNode.style.overflowY = 'auto';
        }
      };
    }, []);

    const filteredTabs = React.useMemo(() => {
      const tabs = ['Profile', 'Photos', 'Body', 'My Outfits'];

      return tabs.filter(tabName => {
        switch (tabName) {
          case 'Profile':
            return !!bodyAttributes.length || !!styleAttributes.length;
          case 'Photos':
            return !!userImages.length;
          case 'Body':
            return !!bodyAttributes.length;
          default:
            return true;
        }
      });
    }, []);

    return (
      <StyledSwipeableViews
        width={width}
        onIndexChange={index => {
          scrollTop('[class*="StyledSlidePageWrapper"]');

          if (filteredTabs[index] === 'My Outfits') {
            rootNode.style.overflowY = 'hidden';
          } else {
            rootNode.style.overflowY = 'auto';
          }
        }}
        renderControls={({ activeViewIndex, changeViewIndex }) => (
          <StyledViewsControls>
            {filteredTabs.map((item, key) => (
              <button
                key={key}
                data-index={key}
                data-is-active={key === activeViewIndex}
                onClick={() => changeViewIndex(key)}
              >
                <span className="sbody-bold">{item}</span>
              </button>
            ))}
          </StyledViewsControls>
        )}
      >
        {(!!bodyAttributes.length || !!styleAttributes.length) && (
          <UserAnalysisEntries
            userAttributes={[...bodyAttributes, ...styleAttributes]}
          />
        )}

        {!!userImages.length && (
          <div className="photos-tab">
            {userImages.map((url, key) => (
              <StyledUserImage key={key} src={url} draggable={false} />
            ))}
          </div>
        )}

        {!!bodyAttributes.length && (
          <UserBodyAttributes
            bodyAttributes={bodyAttributes}
            demographyAttributes={demographyAttributes}
          />
        )}

        <div className="outfits-tab">
          <UserOutfits />
        </div>
      </StyledSwipeableViews>
    );
  }
);

export { UserProfileTabs };
