/* Api */
import { retrieveAnalysisEntriesQuery } from 'App/api/task/retrieveAnalysisEntries';

/* Types */
import {
  CdeTask,
  Statement,
  ANALYSIS_STATEMENT_TYPE,
  AnalysisGroup
} from 'App/types';

const globalGroupName = 'Global';

const sortByPriority = (a: Statement, b: Statement): number =>
  a.priority - b.priority;

const sortByOrder = (a: AnalysisGroup, b: AnalysisGroup): number =>
  a.groupOrder - b.groupOrder;

export const retrieveAnalysisGroups = async (
  task: CdeTask
): Promise<AnalysisGroup[]> => {
  const statementGroups = task.taskResults.statements.reduce<any>(
    (acc, statement) => {
      const groupName = statement.source;

      if (!!acc[groupName]) {
        if (statement.type === ANALYSIS_STATEMENT_TYPE.TEXT) {
          acc[groupName].push(statement);
          return acc;
        }

        if (statement.type === ANALYSIS_STATEMENT_TYPE.IMAGE) {
          const statementIndex = acc[groupName].findIndex(
            item => item.priority === statement.priority
          );

          if (statementIndex === -1) {
            acc[groupName].push({
              ruleGroup: statement.ruleGroup,
              priority: statement.priority,
              source: groupName,
              type: statement.type,
              statements: [statement]
            });

            return acc;
          }

          acc[groupName][statementIndex].statements.push(statement);
          return acc;
        }

        return acc;
      }

      acc[groupName] =
        statement.type === ANALYSIS_STATEMENT_TYPE.IMAGE
          ? [
              {
                ruleGroup: statement.ruleGroup,
                priority: statement.priority,
                source: groupName,
                type: statement.type,
                statements: [statement]
              }
            ]
          : [statement];

      return acc;
    },
    {}
  );

  /* Handle backward compatibility for old tasks that are not splited in groups */
  const isNewTask = !!task.taskResults?.analysisEntries?.[0]?.groupName;
  if (!isNewTask) {
    return [
      {
        entries: task.taskResults?.analysisEntries,
        statements: Object.values<Statement[]>(statementGroups)[0].sort(
          sortByPriority
        )
      }
    ];
  }

  /* Handle new grouped tasks */
  const entriesByGroups = await retrieveAnalysisEntriesQuery({
    groups: [
      ...new Set(task.taskResults.statements.map(statement => statement.source))
    ]
  });

  const analysisGroups = entriesByGroups.reduce<any>((acc, entry) => {
    const resultEntry = {
      ...entry,
      isChosen: !!task.taskResults.analysisEntries.find(
        resultEntry => resultEntry.entryName === entry.entryName
      )
    };

    const groupName = resultEntry.groupName;

    if (!!acc[groupName]) {
      acc[groupName].entries[resultEntry.isChosen ? 'unshift' : 'push'](
        resultEntry
      );

      return acc;
    }

    acc[groupName] = {
      groupName: resultEntry.groupName,
      groupDisplayName: resultEntry.groupDisplayName,
      groupOrder: resultEntry.groupOrder,
      entries: [resultEntry],
      statements: statementGroups[groupName].sort(sortByPriority)
    };

    return acc;
  }, {});

  return [
    ...Object.values<AnalysisGroup>(analysisGroups),
    ...(!!statementGroups[globalGroupName]
      ? [
          {
            groupName: globalGroupName,
            groupDisplayName: 'Our Goal',
            groupOrder: Object.values(analysisGroups).length + 1,
            entries: [],
            statements: statementGroups[globalGroupName].sort(sortByPriority)
          }
        ]
      : [])
  ].sort(sortByOrder);
};
