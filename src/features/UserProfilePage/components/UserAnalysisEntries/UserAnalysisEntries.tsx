import * as React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button } from '@bit/scalez.savvy-ui.button';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import { setPlaceholder } from '@bit/scalez.savvy-ui.utils';
import { noUser } from '@bit/scalez.savvy-ui.svg';

/* Api */
import {
  GQLRetrieveAnalysisEntriesVars,
  retrieveAnalysisEntriesQuery
} from 'App/api/task/retrieveAnalysisEntries';

/* Types */
import { AnalysisEntry, UserAttribute, TASK_TYPE } from 'App/types';

/* Styles */
import { StyledEntryImage, StyledUserAnalysisEntries } from './styles';

type Props = {
  userAttributes: UserAttribute[];
};

const setAttrsByNames = (
  attrs: any,
  attributeNames: string[]
): GQLRetrieveAnalysisEntriesVars['attributesDicts'] => {
  return attributeNames.reduce((acc, name) => {
    const attr = attrs.find(item => item.attributeName === name);

    if (!!attr) {
      acc.push({
        name: attr.attributeName,
        value: attr.value
      });
    }

    return acc;
  }, []);
};

const attributesInfo = [
  {
    name: 'Body',
    attrs: ['BodyTypeStylistEntry', 'BodyTypeVerticalStylistEntry'],
    taskName: 'BodyType2'
  },
  {
    name: 'Color',
    attrs: [
      'DefineColorChromaStylistEntry',
      'DefineColorUndertoneStylistEntry'
    ],
    taskName: 'DefineColor1'
  },
  {
    name: 'Style',
    attrs: [
      'StyleQuiz_StyleTypeStylistEntry',
      'StyleQuiz_StyleType2StylistEntry',
      'StyleQuiz_StyleGoalStylistEntry'
    ],
    taskName: 'DefineStyle1'
  }
];

const entriesPlaceholder = Array(attributesInfo.length)
  .fill({
    image: noUser({
      stroke: 'var(--blueLight',
      scale: 0.6
    })
  })
  .map((item, i) => ({
    ...item,
    displayName: setPlaceholder(9604, 4, 10)
  }));

const UserAnalysisEntries: React.FC<Props> = React.memo(
  ({ userAttributes }: Props) => {
    const history = useHistory();
    const location = useLocation();

    const [userAttributesInfo, setUserAttributesInfo] = React.useState(null);

    const { loading: loadingAnalysisEntries } = useRequest<
      GQLRetrieveAnalysisEntriesVars,
      AnalysisEntry[]
    >(retrieveAnalysisEntriesQuery, {
      initialState: {
        loading: true
      },
      payload: {
        attributesDicts: setAttrsByNames(
          userAttributes,
          attributesInfo.reduce((arr, element) => {
            arr.push(...element.attrs);
            return arr;
          }, [])
        )
      },
      onCompleted: analysisEntries =>
        setUserAttributesInfo(
          attributesInfo.map(info => {
            const entries = analysisEntries.filter(entry =>
              info?.attrs?.includes(entry.attributeName)
            );

            return { ...info, entries };
          })
        )
    });

    const handleTaskRedo = React.useCallback((taskName: string) => {
      history.push({
        pathname: `/task-overview/${taskName}`,
        search: location.search
      });
    }, []);

    return (
      <StyledUserAnalysisEntries data-is-loading={loadingAnalysisEntries}>
        {(loadingAnalysisEntries
          ? entriesPlaceholder
          : userAttributesInfo
        )?.map((category, key) => (
          <React.Fragment key={key}>
            <div className="section-title-block">
              {loadingAnalysisEntries ? (
                <h3>{setPlaceholder(9604, 3, 7)}</h3>
              ) : (
                !!userAttributesInfo[key]?.entries?.length && (
                  <>
                    <h3>{userAttributesInfo[key]?.name}</h3>
                    <Button
                      data-type="secondary"
                      data-size="small"
                      data-action="swap"
                      data-action-position="center-left"
                      onClick={() =>
                        handleTaskRedo(userAttributesInfo[key]?.taskName)
                      }
                    >
                      Redo
                    </Button>
                  </>
                )
              )}
            </div>

            {category?.entries?.map((e, entryKey) => {
              const entry = loadingAnalysisEntries
                ? {
                    image: noUser({
                      stroke: 'var(--blueLight',
                      scale: 0.6
                    }),
                    displayName: setPlaceholder(9604, 4, 10)
                  }
                : e;

              return (
                <div className="analysis-entry-card" key={entryKey}>
                  <StyledEntryImage src={entry?.image} />
                  <span className="sbody-bold">{entry?.displayName}</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </StyledUserAnalysisEntries>
    );
  }
);

export { UserAnalysisEntries };
