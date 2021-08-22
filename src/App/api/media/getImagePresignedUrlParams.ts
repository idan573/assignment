/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { PresigenUrlParameters } from 'App/types';
import { GQLPresigenUrlParameters } from './types';

/* Fragments */
import { presigenUrlParametersFragment } from './fragments';

/* Mappers */
import { presigenUrlParametersMapper } from './mappers';

export interface GQLImagePresignedUrlParamsVars {
  userId: string;
  attributeName?: string;
}

interface GQLUploadUserImage {
  uploadUserImage: GQLPresigenUrlParameters;
}

const UploadUserImage = `
  mutation uploadUserImage(
    $userId: String!
    $attributeName: String
  ) {
    uploadUserImage(
      userId: $userId
      attributeName: $attributeName
    ) ${presigenUrlParametersFragment}
  }
`;

export const getImagePresignedUrlParamsMutation = async (
  variables: GQLImagePresignedUrlParamsVars
): Promise<PresigenUrlParameters> => {
  const {
    uploadUserImage: presigenUrlParams
  } = await graphqlService.graphqlOperation<
    GQLImagePresignedUrlParamsVars,
    GQLUploadUserImage
  >(UploadUserImage, variables);

  return presigenUrlParametersMapper(presigenUrlParams);
};
