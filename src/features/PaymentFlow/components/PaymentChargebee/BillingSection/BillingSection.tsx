import * as React from 'react';
import {
  CardComponent,
  CardNumber,
  CardExpiry,
  CardCVV
} from '@chargebee/chargebee-js-react-wrapper';
import { InputText } from '@bit/scalez.savvy-ui.input-text';

/* Core */
import { delayWithCleanup } from 'core/utils';

/* Types */
import { FormData } from '../PaymentChargebee';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledBillingSection, StyledButton, StyledCardsImage } from './styles';

type Props = {
  isSectionExpanded: boolean;
  error: string;
  loading: boolean;
  formState: FormData;
  openSection: () => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
};

const loaderTexts = [
  'Processing your card...',
  'Validating your info...',
  'Unlocking your style journey...'
];

let timeoutLoaderIn;
let timeoutLoaderOut;

const BillingSection: React.FC<Props> = React.memo(
  React.forwardRef<any, Props>(
    (
      {
        isSectionExpanded,
        error,
        loading,
        formState,
        openSection,
        onChange
      }: Props,
      ref: any
    ) => {
      const {
        state: { userData }
      } = React.useContext<RootContextType>(RootContext);

      const [errors, setErrors] = React.useState<
        Partial<{
          name: string;
          number: string;
          expiry: string;
          cvv: string;
        }>
      >({});

      const [loaderIndex, setLoaderIndex] = React.useState<number>(0);
      const [loaderAnimationState, setLoaderAnimationState] = React.useState<
        boolean
      >(true);

      React.useEffect(() => {
        if (loading) {
          animateLoader(0);
        } else {
          clearTimeout(timeoutLoaderIn);
          clearTimeout(timeoutLoaderOut);
        }
      }, [loading]);

      const animateLoader = React.useCallback(
        async (index: number) => {
          if (!loading) {
            return;
          }

          setLoaderIndex(index);
          setLoaderAnimationState(true);

          await delayWithCleanup(timeoutLoaderIn, 2000);

          setLoaderAnimationState(false);

          await delayWithCleanup(timeoutLoaderOut, 1000);

          animateLoader(index >= loaderTexts.length - 1 ? 0 : index + 1);
        },
        [loading]
      );

      const handleChargebeeChange = React.useCallback(e => {
        setErrors(prevState => ({
          ...prevState,
          [e.field]: e.error ? e.error.message : e.complete ? '' : ''
        }));
      }, []);

      const isProfileSectionReady: boolean = React.useMemo(() => {
        return !!(
          userData?.firstName &&
          userData?.lastName &&
          userData?.email &&
          userData?.phoneNumber
        );
      }, [userData]);

      return (
        <StyledBillingSection
          data-is-expanded={isSectionExpanded}
          data-is-blocked={!isProfileSectionReady}
        >
          <h3 onClick={openSection}>
            Billing Info
            <span data-is-done={loading} className="xsbody-bold">
              Step 2 of 2
            </span>
          </h3>

          <fieldset>
            <InputText
              name="cardHolderName"
              title="Please enter valid full name on the card"
              value={formState.cardHolderName}
              label="FULL NAME ON THE CARD"
              required={true}
              placeholder="Card Holder Name"
              error={errors.name}
              onChange={onChange}
            />

            <CardComponent
              ref={ref}
              className="chargebee-fieldset"
              styles={{
                base: {
                  color: getComputedStyle(
                    document.documentElement
                  ).getPropertyValue('--blueDarker'),

                  '::placeholder': {
                    color: getComputedStyle(
                      document.documentElement
                    ).getPropertyValue('--bluePrimary')
                  }
                }
              }}
              classes={{
                focus: 'focus',
                invalid: 'invalid',
                empty: 'empty',
                complete: 'complete'
              }}
              locale="en"
              onChange={handleChargebeeChange}
            >
              <div className="form-field-wrapper">
                <label data-is-required={true}>CREDIT CARD NUMBER</label>
                <CardNumber
                  className="chargebee-input"
                  placeholder="xxxx xxxx xxxx xxxx"
                />
                <span className="form-field-error">{errors.number}</span>
              </div>

              <div className="inputs-row">
                <div className="form-field-wrapper">
                  <label data-is-required={true}>EXPIRATION</label>
                  <CardExpiry
                    className="chargebee-input"
                    placeholder="MM / YY"
                  />
                  <span className="form-field-error">{errors.expiry}</span>
                </div>

                <div className="form-field-wrapper">
                  <label data-is-required={true}>CVV</label>
                  <CardCVV className="chargebee-input" placeholder="CVV" />
                  <span className="form-field-error">{errors.cvv}</span>
                </div>
              </div>
            </CardComponent>

            <StyledCardsImage />

            <p className="error sbody-bold">{error}</p>

            <p className="secure-payment xsbody">Secure Payment</p>

            <StyledButton
              type="submit"
              data-is-loading={loading}
              data-type={loading ? 'secondary' : 'primary'}
              data-action={loading ? '' : 'next'}
              data-action-position="right"
            >
              {loading ? (
                <span
                  data-slide-in={loaderAnimationState}
                  className="loading-text"
                >
                  {loaderTexts[loaderIndex]}
                </span>
              ) : (
                'Start My Style Journey'
              )}
            </StyledButton>
          </fieldset>
        </StyledBillingSection>
      );
    }
  )
);

export { BillingSection };
