/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { UserAttributesByCategory } from 'App/types';
import { GQLUser, GQLMappedAttributes } from './types';

/* Fragments */
import { mappedAttributesFragment } from './fragments';

/* Mappers */
import { attributesByCategoryMapper } from './mappers';

export type GQLRetrieveUserMappedAttributesVars = {
  userId: string;
  isAddImages?: boolean;
};

interface GQLRetrieveUserMappedAttributes {
  retrieveUserMappedAttributes: GQLMappedAttributes;
}

const RetrieveUserMappedAttributes = `
  query retrieveUserMappedAttributes(
    $userId: String!
    $isAddImages: Boolean
  ) {
    retrieveUserMappedAttributes(
      userId: $userId
      isAddImages: $isAddImages
    ) ${mappedAttributesFragment}
  }
`;

export const retrieveUserMappedAttributesQuery = async (
  variables: GQLRetrieveUserMappedAttributesVars
): Promise<UserAttributesByCategory> => {
  const {
    retrieveUserMappedAttributes: attributes
  } = await graphqlService.graphqlOperation<
    GQLRetrieveUserMappedAttributesVars,
    GQLRetrieveUserMappedAttributes
  >(RetrieveUserMappedAttributes, variables);

  if (!attributes) {
    return null;
    // throw 'There was an error retrieving user attributes';
  }

  return attributesByCategoryMapper(attributes.attributesByCategory);
};
