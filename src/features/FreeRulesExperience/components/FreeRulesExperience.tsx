import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES
} from '@bit/scalez.savvy-ui.header';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import {
  GQLRetrieveUserThreadsVars,
  getUnseenThreadsNumberQuery
} from 'App/api/thread/retrieveUserThreads';
import { getTipsQuery } from 'App/api/rulesExperience/getTips';

/* Types */
import { APP_HEADER_ITEM_TYPES } from 'App/components/AppHeader/AppHeader';
import { RuleTip } from 'App/types';

/* Context */
import { SwipableViews } from 'Layouts/SwipableViews/SwipableViews';
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledFreeRulesExperience, StyledSavvyLogo } from './styles';

interface ExperienceInfo {
  image: string;
  title: string;
  data: {
    productTypes: string[];
    attributes?: { key: string; value: string }[];
  };
}

const getPrefixEnv = () => (ENV === ENVIRONMENTS.PROD ? 'api' : 'stage-api');
const getPrefixEnvShow = () =>
  ENV === ENVIRONMENTS.PROD ? 'show' : 'stage-show';
const mockupData: ExperienceInfo[] = [
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceSexy.png',
    title: 'Sexy Date Night',
    data: {
      productTypes: ['Dress', 'Jacket', 'Top', 'Skirt', 'Shoes'],
      attributes: [
        {
          key: 'RulesExperience',
          value: 'Sexy'
        }
      ]
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceEssentials.png',
    title: 'Essential Must Haves',
    data: {
      productTypes: [
        'Top',
        'Dress',
        'Jeans',
        'Shoes',
        'Skirt',
        'Jacket',
        'Pants',
        'Sweater'
      ],
      attributes: [
        {
          key: 'RulesExperience',
          value: 'Essentials'
        }
      ]
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceTrendy1.png',
    title: 'Stay on Trend',
    data: {
      productTypes: ['Belt', 'Pants', 'Jacket', 'Top', 'Dress'],
      attributes: [
        {
          key: 'RulesExperience',
          value: 'Trendy'
        }
      ]
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceBelt1.png',
    title: 'Belt it Up',
    data: {
      productTypes: ['Belt']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceJeans.png',
    title: 'Perfect Jeans for Your Booty',
    data: {
      productTypes: ['Jeans']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceShoes.png',
    title: 'Step into Style',
    data: {
      productTypes: ['Shoes']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceTop.png',
    title: 'Tops that Flatter You',
    data: {
      productTypes: ['Top']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceSkirt.png',
    title: 'Swing into New Skirts',
    data: {
      productTypes: ['Skirt']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceJacket1.png',
    title: 'Warm Up With Jackets',
    data: {
      productTypes: ['Jacket']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceSweater.png',
    title: 'Sweater Weather',
    data: {
      productTypes: ['Sweater']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceDress.png',
    title: 'Dresses Just for You',
    data: {
      productTypes: ['Dress']
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceAccessories.png',
    title: 'Accessorize Yourself',
    data: {
      productTypes: ['Bag', 'Jewelry'],
      attributes: [
        {
          key: 'RulesExperience',
          value: 'Accessories'
        }
      ]
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceSexyCasual1.png',
    title: 'Sexy Casual',
    data: {
      productTypes: ['Top', 'Skirt', 'Dress', 'Shoes'],
      attributes: [
        {
          key: 'RulesExperience',
          value: 'SexyCasual'
        }
      ]
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceLoudPrints.png',
    title: 'Get Colorful With Prints',
    data: {
      productTypes: [
        'Bag',
        'Belt',
        'Jacket',
        'Coat',
        'Dress',
        'Shoes',
        'Skirt',
        'Sweater',
        'Top',
        'Pants',
        'Jeans'
      ],
      attributes: [
        {
          key: 'RulesExperience',
          value: 'LoudPrints'
        }
      ]
    }
  },
  {
    image: 'https://profiles.scalez.io/tasks/RulesExperienceSwimsuit.png',
    title: 'Swim into Summer',
    data: {
      productTypes: ['Swimsuit']
    }
  }
];

const FreeRulesExperience: React.FC<RouteComponentProps> = ({
  history
}: RouteComponentProps) => {
  const {
    state: { userData },
    actions: { setActiveStepData, trackPage, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const { data: unseenThreadsNumber } = useRequest<
    GQLRetrieveUserThreadsVars,
    number
  >(getUnseenThreadsNumberQuery, {
    payload: {
      userId: userData.userId
    }
  });

  const { data: tips } = useRequest<{}, RuleTip[]>(getTipsQuery);

  React.useEffect(() => {
    if (!!userData?.userId) {
      trackPage({
        name: 'FreeStyleups'
      });
    }
  }, []);

  React.useEffect(() => {
    setActiveStepData(prevState => ({
      ...prevState,
      headerConfig: [
        {
          type: HEADER_ITEM_TYPES.TITLE,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT,
            children: 'Tips'
          }
        },
        {
          type: APP_HEADER_ITEM_TYPES.NOTIFICATION,
          props: {
            notificationsCount: unseenThreadsNumber
          }
        },
        {
          type: HEADER_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'menu',
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT
          }
        }
      ]
    }));
  }, [unseenThreadsNumber]);

  const onItemClick = React.useCallback((item: RuleTip) => {
    trackEvent({
      event: EVENTS.FREE_STYLE_OPENED,
      properties: {
        title: item?.displayName
      },
      callback: () => {
        history.push({
          pathname: 'flow/re',
          state: {
            productTypes: item?.productsTypes.map(p => p.name),
            attributes: item?.attributes,
            rulesIds: item?.rules?.map(r => r.ruleId)
          }
        });
      }
    });
  }, []);

  const experiences = React.useMemo(() => {
    /*
    return mockupData.map((item, index) => {
      return (
        <div
          className="experience-item"
          key={index}
          onClick={() => onItemClick(item)}
        >
          <img src={item.image} alt="" />
          <div className="title-container">
            <p className="body-bold">{item.title}</p>
          </div>
        </div>
      );
    });*/
    return tips?.map((item, index) => {
      return (
        <div
          className="experience-item"
          key={index}
          onClick={() => onItemClick(item)}
        >
          <img src={item.image} alt="" />
          <div className="title-container">
            <p className="body-bold">{item?.displayName}</p>
          </div>
        </div>
      );
    });
  }, [tips]);

  return (
    <>
      <StyledFreeRulesExperience>
        <SwipableViews>
          <div className="swiped-bar-element">
            <div className="desc">
              <div className="desc-content">
                <StyledSavvyLogo />
                <h3>Welcome</h3>
                <p className="body">
                  Tips are fun swipeable style experiences curated by Savvy.
                </p>
              </div>
            </div>
          </div>
          <div className="swiped-bar-element">
            <div className="desc">
              <div className="desc-content">
                <StyledSavvyLogo />
                <h3>Share Your Style</h3>
                <p className="body">
                  Help your stylist learn your style preference from what you
                  add
                </p>
              </div>
            </div>
          </div>
          <div className="swiped-bar-element">
            <div className="desc">
              <div className="desc-content">
                <StyledSavvyLogo />
                <h3>Just for You</h3>
                <p className="body">
                  Tips you see will become more tailored as Savvy learns your
                  taste!
                </p>
              </div>
            </div>
          </div>
        </SwipableViews>
        <h2>Today's Tips</h2>
        <div className="rules-experience-grid">{experiences}</div>
      </StyledFreeRulesExperience>
    </>
  );
};

export default FreeRulesExperience;
