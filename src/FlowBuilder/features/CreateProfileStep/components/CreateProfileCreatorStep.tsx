import * as React from 'react';
import { captureException } from '@sentry/browser';
import TopBarProgress from 'react-topbar-progress-indicator';
import PhoneInput, { formatPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { InputText } from '@bit/scalez.savvy-ui.input-text';
import { InputFile } from '@bit/scalez.savvy-ui.input-file';
import { Button } from '@bit/scalez.savvy-ui.button';
import {
  useRequest,
  useLazyRequest,
  usePresignedUrlFileUpload
} from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLUpdateUserVars, updateUserMutation } from 'App/api/user/updateUser';
import {
  GQLImagePresignedUrlParamsVars,
  getImagePresignedUrlParamsMutation
} from 'App/api/media/getImagePresignedUrlParams';

/* Types */
import { CLIENT_TYPE, PresigenUrlParameters } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledCreateProfilePage } from './styles';
import { FlowRouteProps } from 'FlowBuilder/types';

interface FormType {
  profilePicture: string;
  firstName: string;
  lastName: string;
  email: string;
}

const CreateProfileCreatorStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      state: { userData },
      actions: { setPartialUserData, trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [formState, setFormState] = React.useState<Partial<FormType>>({
      profilePicture: userData?.profilePicture ?? '',
      firstName: userData?.firstName ?? '',
      lastName: userData?.lastName ?? '',
      email: userData?.email ?? ''
    });

    const {
      data: presignedUrlParams = {},
      loading: loadingPresignedUrlParams
    } = useRequest<GQLImagePresignedUrlParamsVars, PresigenUrlParameters>(
      getImagePresignedUrlParamsMutation,
      {
        payload: {
          userId: userData.userId
        }
      }
    );

    const [updateUser, { loading: updateUserLoading }] = useLazyRequest<
      GQLUpdateUserVars,
      void
    >(updateUserMutation);

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
        captureException(error, {
          tags: {
            userId: userData.userId
          }
        });
      }
    });

    const handleFormChange = React.useCallback(
      (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;

        setFormState(prevState => ({
          ...prevState,
          [name]: value
        }));
      },
      []
    );

    const handleSubmit = React.useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formState?.email && window?.Autopilot) {
          console.log(`Autopilot.run email=${formState?.email}`);

          window?.Autopilot?.run('associate', {
            Email: formState?.email
          });
        }

        /* upload picture only if it was changed */
        if (!!imageData.file) {
          await handleProfilePicUpload();
        }

        /* Save client user data */
        setPartialUserData({
          ...formState,
          profilePicture: !!imageData.file
            ? imageData.url
            : formState.profilePicture
        });

        /* Save server user data */
        updateUser({
          userId: userData?.userId,
          attributes: {
            profilePic: !!imageData.file
              ? imageData.url
              : formState.profilePicture,
            firstName: formState?.firstName,
            lastName: formState?.lastName,
            email: formState?.email,
            clientType: CLIENT_TYPE.FOLLOWER
          }
        });

        trackEvent({
          event: EVENTS.PROFILE_CREATED,
          properties: {
            firstName: formState?.firstName,
            lastName: formState?.lastName
          }
        });

        onNext?.();
      },
      [imageData, handleProfilePicUpload, formState]
    );

    return (
      <>
        {(loadingPresignedUrlParams ||
          updateUserLoading ||
          profilePictureLoading) && <TopBarProgress />}

        <StyledCreateProfilePage>
          <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <fieldset>
              <InputFile
                title="Please upload profile picture"
                name="profilePicture"
                value={
                  (imageData.arrayBuffer as string) || formState.profilePicture
                }
                loading={profilePictureLoading}
                required={false}
                accept="image/*"
                onChange={handleProfilePicChange}
              />

              <InputText
                name="firstName"
                value={formState.firstName}
                label="First Name"
                required={true}
                placeholder="First Name"
                onChange={handleFormChange}
              />
              <InputText
                name="lastName"
                value={formState.lastName}
                label="Last Name"
                required={true}
                placeholder="Last Name"
                onChange={handleFormChange}
              />

              <InputText
                title="Valid e-mail can contain only latin letters, numbers, '@' and '.'"
                type="email"
                name="email"
                value={formState.email}
                label="Email"
                required={true}
                inputMode="email"
                pattern="[^@\s]+@[^@\s]+"
                autoComplete="email"
                placeholder="Email Address"
                onChange={handleFormChange}
              />
            </fieldset>

            <Button type="submit">Create Profile</Button>
          </form>
        </StyledCreateProfilePage>
      </>
    );
  }
);

export default CreateProfileCreatorStep;
