/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { PresigenUrlParameters } from 'App/types';
import { GQLPresigenUrlParameters } from './types';

/* Fragments */
import { presigenUrlParametersFragment } from './fragments';

/* Mappers */
import { presigenUrlParametersMapper } from './mappers';

export interface GQLVideoPresignedUrlParamsVars {
  userId: string;
  attributeName?: string;
  extension?: string;
}

interface GQLUploadUserVideo {
  uploadUserVideo: GQLPresigenUrlParameters;
}

const UploadUserVideo = `
  mutation uploadUserVideo(
    $userId: String!
    $attributeName: String
    $extension: String
  ) {
    uploadUserVideo(
      userId: $userId
      attributeName: $attributeName
      extension: $extension
    ) ${presigenUrlParametersFragment}
  }
`;

export const getVideoPresignedUrlParamsMutation = async (
  variables: GQLVideoPresignedUrlParamsVars
): Promise<PresigenUrlParameters> => {
  const {
    uploadUserVideo: presigenUrlParams
  } = await graphqlService.graphqlOperation<
    GQLVideoPresignedUrlParamsVars,
    GQLUploadUserVideo
  >(UploadUserVideo, variables);

  return presigenUrlParametersMapper(presigenUrlParams);
};
