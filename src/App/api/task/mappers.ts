/* Types */
import {
  Product,
  PRODUCT_CATEGORIES,
  AnalysisEntry,
  TaskRoute,
  Statement,
  ANALYSIS_STATEMENT_TYPE,
  StylistResponse,
  TaskResults,
  TaskContext,
  TaskUserAttributes,
  TaskData,
  CdeTask,
  TASK_TYPE
} from 'App/types';
import {
  GQLAnalysisEntry,
  GQLTaskRoute,
  GQLStatement,
  GQLEdeTaskStyle,
  GQLStylistResponse,
  GQLTaskResults,
  GQLTaskContext,
  GQLTaskUserAttributes,
  GQLTaskData,
  GQLCdeTask
} from './types';

/* Mappers */
import { stylistMapper } from 'App/api/stylist/mappers';
import { productMapper } from 'App/api/closet/mappers';

export const analysisEntryMapper = ({
  attributeValue,
  ...gqlAnalysisEntry
}: GQLAnalysisEntry = {}): AnalysisEntry => ({
  ...gqlAnalysisEntry
});

const statementMapper = ({
  name,
  type,
  info,
  answer,
  rowSize,
  ...gqlStatement
}: GQLStatement = {}): Statement => ({
  ...gqlStatement,
  type: type as ANALYSIS_STATEMENT_TYPE,
  columnCount: +rowSize || 1,
  statementHint: info,
  statementName: name,
  statementTemplate: answer
});

export const taskRouteMapper = ({
  ...gqlTaskRoute
}: GQLTaskRoute = {}): TaskRoute => ({
  ...gqlTaskRoute
});

const categoriseProducts = (
  styles: GQLEdeTaskStyle[],
  closetProductIds: string[] = []
) => {
  const allProducts = (styles || []).reduce((acc, style) => {
    acc.push(
      ...(style?.products ?? []).map(product => {
        const mappedProduct = productMapper(product);

        return {
          ...mappedProduct,
          inWishlist: closetProductIds.some(
            id => id === mappedProduct.productId
          )
        };
      })
    );

    return acc;
  }, []);

  const categorizedProducts: {
    [key in keyof PRODUCT_CATEGORIES]?: Product[];
  } = allProducts.reduce((acc, product) => {
    const normalizedCategory = product.productCategory || '';

    if (acc[normalizedCategory]) {
      acc[normalizedCategory].push(product);
    } else {
      acc[normalizedCategory] = [product];
    }

    return acc;
  }, {});

  return categorizedProducts;
};

const stylistResponseMapper = ({
  ...gqlStylistResponse
}: GQLStylistResponse = {}): StylistResponse => ({
  ...gqlStylistResponse
});

const taskResultsMapper = (
  {
    stylistResponse,
    styles,
    statements,
    analysisEntries,
    ...gqlTaskResults
  }: GQLTaskResults = {},
  closetProductIds: string[] = []
): TaskResults => ({
  ...gqlTaskResults,
  stylistResponse: stylistResponseMapper(stylistResponse || {}),
  categorisedProducts: categoriseProducts(styles || [], closetProductIds),
  statements: statements?.map(statementMapper) ?? [],
  analysisEntries: analysisEntries?.map(analysisEntryMapper) ?? []
});

const taskContextMapper = ({
  title,
  image,
  description,
  nextTaskDescription,
  nextTaskName,
  ...gqlTaskContext
}: GQLTaskContext = {}): TaskContext => ({
  ...gqlTaskContext,
  taskImage: image,
  taskTitle: title,
  taskDescription: description,
  nextTask: {
    taskName: nextTaskName,
    taskDescription: nextTaskDescription
  }
});

const taskUserAttributesMapper = ({
  FirstName,
  LastName,
  ProfilePicture,
  firstName,
  lastName,
  profilePic,
  ...gqlUserAttributes
}: GQLTaskUserAttributes = {}): TaskUserAttributes => ({
  ...gqlUserAttributes,
  firstName: FirstName || firstName,
  lastName: LastName || lastName,
  profilePicture: ProfilePicture || profilePic
});

const taskDataMapper = ({
  userId,
  userAttributes,
  userResponse,
  userResponseImages,
  stylistId,
  stylist,
  taskImages,
  ...gqlTaskData
}: GQLTaskData = {}): TaskData => {
  const mappedTaskUserAttributes = taskUserAttributesMapper(
    userAttributes || {}
  );

  return {
    ...gqlTaskData,
    userResponse: userResponse || '',
    userResponseImages: userResponseImages || [],
    stylist: {
      stylistId: stylistId || stylist?.stylistId,
      firstName: stylist?.stylistFirstName,
      lastName: stylist?.stylistLastName,
      profilePicture: stylist?.stylistImage
    },
    user: {
      ...mappedTaskUserAttributes,
      userId,
      uploadImages: taskImages || []
    }
  };
};

export const cdeTaskMapper = (
  {
    taskType,
    taskData,
    taskContext,
    taskResults,
    ...gqlCdeTask
  }: GQLCdeTask = {},
  closetProductIds: string[] = []
): CdeTask => {
  const mappedTaskData = taskDataMapper(taskData || {});
  const mappedTaskContext = taskContextMapper(taskContext || {});

  return {
    ...gqlCdeTask,
    ...mappedTaskContext,
    ...mappedTaskData,
    taskType: taskType as TASK_TYPE,
    taskResults: taskResultsMapper(taskResults || {}, closetProductIds)
  };
};

export const taskDefinitionMapper = (
  {
    taskType,
    taskData,
    taskContext,
    taskResults,
    ...gqltaskDefinition
  }: GQLCdeTask = {},
  closetProductIds: string[] = []
): CdeTask => {
  const mappedTaskData = taskDataMapper(taskData || {});
  const mappedTaskContext = taskContextMapper(taskContext || {});

  return {
    ...gqltaskDefinition,
    ...mappedTaskContext,
    ...mappedTaskData,
    taskType: taskType as TASK_TYPE
  };
};
