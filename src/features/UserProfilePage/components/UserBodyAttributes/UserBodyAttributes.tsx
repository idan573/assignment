import * as React from 'react';
import {
  triangle,
  height,
  ageCalendar,
  shirt,
  pants,
  bra
} from '@bit/scalez.savvy-ui.svg';

/* Types */
import { UserAttribute } from 'App/types';

/* Styles */
import { StyledBodyAttrIcon, StyledUserBodyAttributes } from './styles';

type Props = {
  bodyAttributes: UserAttribute[];
  demographyAttributes: UserAttribute[];
};

const UserBodyAttributes: React.FC<Props> = React.memo(
  ({ bodyAttributes = [], demographyAttributes = [] }: Props) => {
    const mappedBodyAttributes = React.useMemo(() => {
      return [...bodyAttributes, ...demographyAttributes].reduce(
        (acc, attr) => {
          switch (attr.name) {
            case 'Top Size':
              {
                acc.main[0] = {
                  gridRow: 1,
                  icon: shirt(),
                  name: attr.name,
                  value: attr.value
                };
              }
              break;
            case 'Pant Size':
              {
                acc.main[1] = {
                  gridRow: 1,
                  icon: pants(),
                  name: attr.name,
                  value: attr.value
                };
              }
              break;
            case 'Bra Cup':
              {
                acc.main[2] = {
                  gridRow: 1,
                  icon: bra(),
                  name: attr.name,
                  value: attr.value
                };
              }
              break;
            case 'Height':
              {
                acc.main[3] = {
                  gridRow: 2,
                  icon: height(),
                  name: attr.name,
                  value: attr.value
                };
              }
              break;
            case 'Age':
              {
                acc.main[4] = {
                  gridRow: 2,
                  icon: ageCalendar(),
                  name: attr.name,
                  value: attr.value
                };
              }
              break;
            case 'Body Part Flaunt':
              {
                acc.main[5] = {
                  gridRow: 3,
                  icon: triangle({ fill: 'var(--green' }),
                  name: 'Strength',
                  value: attr.value
                };
              }
              break;
            case 'Body Part Downplay':
              {
                acc.main[6] = {
                  gridRow: 3,
                  icon: triangle({ fill: 'var(--red', rotate: 180 }),
                  name: 'Weakness',
                  value: attr.value
                };
              }
              break;
            default:
              acc.rest.push({
                name: attr.name,
                value: attr.value
              });
          }

          return acc;
        },
        {
          main: [],
          rest: []
        }
      );
    }, []);

    return (
      <StyledUserBodyAttributes>
        <div className="attributes-grid">
          {mappedBodyAttributes.main.map((attr, key) => (
            <div
              key={key}
              className="attribute-card"
              style={{ '--gridRow': attr.gridRow } as React.CSSProperties}
            >
              <StyledBodyAttrIcon src={attr.icon} />
              <h3>{attr.value}</h3>
              <span className="sbody">{attr.name}</span>
            </div>
          ))}
        </div>

        {!!mappedBodyAttributes.rest.length && (
          <>
            <h2>More</h2>
            <div>
              {mappedBodyAttributes.rest.map((attr, key) => (
                <div key={key} className="attribute-block">
                  <span className="sbody">{attr.name}</span>
                  <span className="sbody-bold">{attr.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </StyledUserBodyAttributes>
    );
  }
);

export { UserBodyAttributes };
