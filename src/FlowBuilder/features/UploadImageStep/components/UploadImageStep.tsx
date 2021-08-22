import * as React from 'react';
import {
  useClipboardNotification,
  usePresignedUrlFileUpload,
  useRequest
} from '@bit/scalez.savvy-ui.hooks';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Notification } from '@bit/scalez.savvy-ui.notification';

/* Types */
import { FlowRouteProps } from 'FlowBuilder/types';
import {
  GQLImagePresignedUrlParamsVars,
  getImagePresignedUrlParamsMutation
} from 'App/api/media/getImagePresignedUrlParams';
import { PresigenUrlParameters } from 'App/types';

/* Context */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

/* Styles */
import { StyledUploadImageStep } from './styles';
import { captureException } from 'logrocket';
import { InputFile } from '@bit/scalez.savvy-ui.input-file';

const UploadImageStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      actions: { setActiveStepData }
    } = React.useContext<FlowContextType>(FlowContext);

    const {
      data: presignedUrlParams = {},
      loading: loadingPresignedUrlParams
    } = useRequest<GQLImagePresignedUrlParamsVars, PresigenUrlParameters>(
      getImagePresignedUrlParamsMutation,
      {
        payload: {
          userId: '4775387309168296'
        }
      }
    );

    const [
      handleProfilePicUpload,
      handleProfilePicChange,
      { data: imageData, loading: profilePictureLoading }
    ] = usePresignedUrlFileUpload({
      payload: {
        presignedUrl: presignedUrlParams.presignedUrl,
        endpoint: presignedUrlParams.endpoint,
        headers: presignedUrlParams.headers
      },
      onError: error => {
        console.error('Profile picture FileReader error: ', error);
      }
    });

    const [clipboardNotificationActive, copy] = useClipboardNotification(
      imageData?.url
    );

    return (
      <StyledUploadImageStep>
        <Notification render={clipboardNotificationActive}>
          Image link copied to your clipboard
        </Notification>
        <form>
          <img
            src={
              'https://user-management-stage-images-605804221399.s3.amazonaws.com/images/userid=4775387309168296/attributename=userImage/DBGzKeKsj2X5BtJ2t3EyfR.jpeg'
            }
          />
          <InputFile
            title="Please upload profile picture"
            name="profilePicture"
            value={imageData.arrayBuffer as string}
            loading={profilePictureLoading}
            required={false}
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </form>
        <Button
          onClick={async () => {
            if (!!imageData.file) {
              await handleProfilePicUpload();
              copy();
            }
          }}
        >
          Done
        </Button>
      </StyledUploadImageStep>
    );
  }
);

export default UploadImageStep;
