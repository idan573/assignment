import * as React from 'react';
import { InputText } from '@bit/scalez.savvy-ui.input-text';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { FormData } from '../PaymentChargebee';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledProfileSection } from './styles';

interface Props {
  isSectionExpanded: boolean;
  formState: FormData;
  openSection: () => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: (data: FormData) => void;
}

const ProfileSection: React.FC<Props> = ({
  isSectionExpanded,
  formState,
  openSection,
  onChange,
  onSubmit
}: Props) => {
  const {
    state: { userData },
    actions: { trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const handleFormSubmit = React.useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      onSubmit(formState);
    },
    [formState]
  );

  return (
    <StyledProfileSection data-is-expanded={isSectionExpanded}>
      <h3 onClick={openSection}>
        Contact Info
        <span data-is-done={!isSectionExpanded} className="xsbody-bold">
          Step 1 of 2
        </span>
      </h3>
      <fieldset>
        <InputText
          title="Please enter your first name"
          name="firstName"
          value={formState.firstName}
          label="First Name"
          required={true}
          placeholder="First Name"
          onChange={onChange}
        />

        <InputText
          title="Please enter your last name"
          name="lastName"
          value={formState.lastName}
          label="Last Name"
          required={true}
          placeholder="Last Name"
          onChange={onChange}
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
          onChange={onChange}
        />
      </fieldset>

      <Button
        data-action="next"
        data-action-position="right"
        onClick={handleFormSubmit}
      >
        Next
      </Button>
    </StyledProfileSection>
  );
};

export { ProfileSection };
