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
import { User, CLIENT_TYPE, PresigenUrlParameters } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledCreateProfilePage } from './styles';

interface Props {
  onSubmit?: () => void;
}

interface FormType {
  profilePicture: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const CreateProfileComponent: React.FC<Props> = ({ onSubmit }: Props) => {
  const {
    state: { userData },
    actions: { setPartialUserData, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const [formState, setFormState] = React.useState<Partial<FormType>>({
    profilePicture: userData?.profilePicture ?? '',
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    email: userData?.email ?? '',
    phoneNumber: userData?.phoneNumber ?? ''
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

  const handlePhoneInputChange = React.useCallback((value: string) => {
    setFormState(prevState => ({
      ...prevState,
      phoneNumber: value || ''
    }));
  }, []);

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
          phoneNumber: formState?.phoneNumber,
          clientType: userData?.clientType ?? CLIENT_TYPE.SAVVY
        }
      });

      trackEvent({
        event: EVENTS.PROFILE_CREATED,
        properties: {
          firstName: formState?.firstName,
          lastName: formState?.lastName
        }
      });

      onSubmit?.();
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
              required={true}
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

            <div className="form-field-wrapper">
              <label htmlFor="phoneNumber" data-is-required={true}>
                Phone number
              </label>
              <p className="form-field-description">
                Why? We would love to alert you when your StyleUps are ready :)
              </p>

              <PhoneInput
                international={true}
                className="phone-input-container"
                title="Phone number may contain minimum 10 digits"
                name="phoneNumber"
                defaultCountry="US"
                value={formState.phoneNumber}
                type="tel"
                autoComplete="tel"
                required={true}
                placeholder="+1 123 4567 890"
                inputMode="tel"
                pattern=".{15,25}"
                minLength={10}
                maxLength={20}
                onChange={handlePhoneInputChange}
              />
            </div>
          </fieldset>

          <Button type="submit">Create Profile</Button>
        </form>
      </StyledCreateProfilePage>
    </>
  );
};

export { CreateProfileComponent };
