import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { Rule } from 'App/types';

/* Components */
import { ImageWithLoader } from 'Layouts/ImageWithLoader/ImageWithLoader';

/* Styles */
import { StyledRulesExperienceComponent } from './styles';

interface Props {
  rule: Rule;
  onRateClick: (isLiked: boolean) => void;
}

const RulesExperienceComponent: React.FC<Props> = React.memo(
  ({ onRateClick, rule }: Props) => {
    return (
      <>
        <StyledRulesExperienceComponent>
          <ImageWithLoader className="image-block" src={rule?.image} />

          <div className="content-block">
            <p className="body">{rule?.ruleLongText}</p>

            <div className="tags-block">
              {rule?.tags?.map((item: string, key) => (
                <span className="sbody-bold" key={key}>
                  #{item}
                </span>
              ))}
            </div>

            <div className="buttons-block">
              <Button
                data-type="secondary"
                disabled={status === REQUEST_STATUSES.REQUEST}
                onClick={() => onRateClick(false)}
              >
                Not for me
              </Button>

              <Button
                disabled={status === REQUEST_STATUSES.REQUEST}
                onClick={() => onRateClick(true)}
              >
                Show me
              </Button>
            </div>
          </div>
        </StyledRulesExperienceComponent>
      </>
    );
  }
);

export { RulesExperienceComponent };
