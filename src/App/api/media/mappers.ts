import { PresigenUrlParameters } from 'App/types';
import { GQLPresigenUrlParameters } from './types';

export const presigenUrlParametersMapper = ({
  uploadParameters,
  fileUrl
}: GQLPresigenUrlParameters = {}): PresigenUrlParameters => ({
  presignedUrl: fileUrl,
  endpoint: uploadParameters?.url,
  headers: uploadParameters?.fields?.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {})
});
