import React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLUpdateUserVars, updateUserMutation } from 'App/api/user/updateUser';

/* Context */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledPhoneNumberFormComponent } from './styles';

type FormState = { phoneNumber: string };

interface Props {
  onSubmit?: (data: FormState) => void;
}

const PhoneNumberFormComponent: React.FC<Props> = ({ onSubmit }: Props) => {
  const {
    state: { userData },
    actions: { trackEvent, setPartialUserData }
  } = React.useContext<RootContextType>(RootContext);

  const [updateUser] = useLazyRequest<GQLUpdateUserVars, void>(
    updateUserMutation
  );

  const [formState, setFormState] = React.useState<FormState>({
    phoneNumber: userData.phoneNumber || ''
  });

  const handlePhoneInputChange = React.useCallback((value: string) => {
    setFormState(prevState => ({
      ...prevState,
      phoneNumber: value || ''
    }));
  }, []);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      trackEvent({
        event: EVENTS.PHONE_NUMBER_SUBMITTED,
        properties: {
          userId: userData.userId,
          phoneNumber: formState.phoneNumber
        }
      });

      setPartialUserData({
        phoneNumber: formState.phoneNumber
      });

      updateUser({
        userId: userData.userId,
        attributes: {
          phoneNumber: formState.phoneNumber
        }
      });

      onSubmit?.(formState);
    },
    [formState]
  );

  return (
    <StyledPhoneNumberFormComponent>
      <form onSubmit={handleSubmit}>
        <h2>
          {`Hey ${userData.firstName ?? 'guest'}, what’s your phone number?`}
        </h2>

        <div className="form-field-wrapper">
          <p className="form-field-description">
            {`Hey ${userData?.firstName ??
              ''}, where should we send your results?`}
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

        <Button type="submit">Continue</Button>
      </form>
    </StyledPhoneNumberFormComponent>
  );
};

export { PhoneNumberFormComponent };
