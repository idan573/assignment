import * as React from 'react';
import { captureException } from '@sentry/browser';
import { RouteComponentProps } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Button } from '@bit/scalez.savvy-ui.button';
import {
  useRequest,
  useLazyPresignedUrlFileUpload
} from '@bit/scalez.savvy-ui.hooks';

/* Api */
import { updateUserMutation } from 'App/api/user/updateUser';
import {
  GQLRetrieveUserMappedAttributesVars,
  retrieveUserMappedAttributesQuery
} from 'App/api/user/retrieveUserMappedAttributes';
import { getImagePresignedUrlParamsMutation } from 'App/api/media/getImagePresignedUrlParams';

/* Types */
import { UserAttributesByCategory, PresigenUrlParameters } from 'App/types';
import { EVENTS } from 'services/analyticsService';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { UserProfileTabs } from './UserProfileTabs/UserProfileTabs';

/* Styles */
import { StyledUserProfilePage, StyledUserProfileImage } from './styles';

type Props = RouteComponentProps;

const UserProfilePage: React.FC<Props> = React.memo(() => {
  const inputFileImageRef = React.useRef<HTMLInputElement>(null);

  const {
    state: { userData },
    actions: { trackPage, trackEvent, setPartialUserData }
  } = React.useContext<RootContextType>(RootContext);

  const [
    imageFileUpload,
    imageFileOnChange,
    { data: imageFileData },
    handleImageDispatch
  ] = useLazyPresignedUrlFileUpload({
    async onRead(data) {
      const imageParams = await handleImageUpload(data.file);

      setPartialUserData({
        profilePicture: imageParams.presignedUrl
      });

      updateUserMutation({
        userId: userData.userId,
        attributes: {
          profilePic: imageParams.presignedUrl
        }
      });
    },
    onError(error) {
      console.error('Image FileReader error: ', error);
      captureException(error, {
        tags: {
          userId: userData.userId
        }
      });
    }
  });

  const handleImageUpload = React.useCallback(async (imageFile: File): Promise<
    PresigenUrlParameters
  > => {
    try {
      if (!!imageFile) {
        const imageParams = await getImagePresignedUrlParamsMutation({
          userId: userData.userId
        });

        await imageFileUpload({
          file: imageFile,
          presignedUrl: imageParams.presignedUrl,
          endpoint: imageParams.endpoint,
          headers: imageParams.headers
        });

        trackEvent({
          event: EVENTS.IMAGE_UPLOAD_CLICKED,
          properties: {
            userId: userData.userId,
            stylistId: userData.homePageStylist,
            timestamp: Date.now(),
            component: 'UserProfilePage'
          }
        });

        return imageParams;
      }

      return {};
    } catch (error) {
      return {};
    }
  }, []);

  const { data: attributes = {}, loading: loadingAttributes } = useRequest<
    GQLRetrieveUserMappedAttributesVars,
    UserAttributesByCategory
  >(retrieveUserMappedAttributesQuery, {
    skip: !userData?.userId,
    initialState: {
      loading: true
    },
    payload: {
      userId: userData.userId
    }
  });

  React.useEffect(() => {
    trackPage({
      name: 'UserProfilePage'
    });
  }, []);

  return (
    <>
      {loadingAttributes ? (
        <TopBarProgress />
      ) : (
        <StyledUserProfilePage>
          <div className="profile-picture-block">
            <input
              ref={inputFileImageRef}
              type="file"
              accept="image/*"
              onChange={imageFileOnChange}
            />

            <Button
              data-form="circle"
              data-size="small"
              data-type="secondary"
              data-action="camera"
              data-action-position="center"
              onClick={() => inputFileImageRef.current.click()}
            />

            <StyledUserProfileImage
              src={
                (imageFileData.arrayBuffer as string) || userData.profilePicture
              }
            />
            <h4>{userData.firstName}</h4>
          </div>

          <UserProfileTabs
            userImages={userData.uploadImages}
            bodyAttributes={attributes.body}
            styleAttributes={attributes.style}
            demographyAttributes={attributes.demography}
          />
        </StyledUserProfilePage>
      )}
    </>
  );
});

export default UserProfilePage;
