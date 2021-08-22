import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Assets */
import gloriaImg from '../assets/gloria.png';
import tawniImg from '../assets/tawni.png';
import tiffanyImg from '../assets/tiffany.png';

import bannerImg1 from '../assets/1.jpg';
import bannerImg2 from '../assets/2.jpg';
import bannerImg3 from '../assets/3.jpg';

/* Layouts */
import { SwipableViews } from 'Layouts/SwipableViews/SwipableViews';

/* Styles */
import {
  StyledHowItWorksPage,
  StyledCarouselImage,
  StyledReviewImage
} from './styles';

interface Props {
  onClick: () => void;
}

const swipableList = [
  {
    img: bannerImg1,
    title: 'Personalized Makeover Journey',
    description:
      'Personal style isn’t one size fits all. Savvy guides you through a complete makeover journey to transform your style.'
  },
  {
    img: bannerImg2,
    title: 'A Smarter Way to Shop',
    description:
      'Say “bye bye” to buyer’s remorse! Your Savvy Stylist curates looks that fit your budget. She can even build outfits around a piece you already own and love!'
  },
  {
    img: bannerImg3,
    title: 'Your Very Own Personal Stylist',
    description:
      'Access a real, live personal stylist as often as you’d like. She’s always on-hand to give you style advice and address your needs.'
  }
];

const reviewsList = [
  {
    img: gloriaImg,
    title: 'Gloria',
    description:
      'Flo, my stylist, sent me the coolest body analysis report! We worked together to figure out my style and now it’s so much easier to get dressed in the morning.'
  },
  {
    img: tawniImg,
    title: 'Tawni',
    description:
      'My stylist Jenilee is seriously a therapist in disguise. She has elevated my style and has helped me command respect from my job.'
  },
  {
    img: tiffanyImg,
    title: 'Tiffany',
    description: `I love this app - it's so much better than those box services. I get to actually talk to my stylist without pressure to buy, plus now I understand what ACTUALLY looks good on my body.`
  }
];

const subscriptionsList = [
  'Get out of your style rut',
  'Create your own signature style with items you can cherish forever',
  'Create a meaningful connection with your stylist'
];

const HowItWorksComponent: React.FC<Props> = ({ onClick }: Props) => {
  return (
    <>
      <StyledHowItWorksPage>
        <SwipableViews>
          {swipableList.map((item, key) => (
            <div key={key} className="banner-block">
              <StyledCarouselImage src={item.img} />
              <h3>{item.title}</h3>
              <p className="sbody">{item.description}</p>
            </div>
          ))}
        </SwipableViews>

        <div className="reviews-section section">
          <h2 className="section-title">
            Join people who already tried Savvy!
          </h2>

          {reviewsList.map((item, key) => (
            <div key={key} className="review-block">
              <StyledReviewImage src={item.img} />
              <span className="body-bold user-name">{item.title}</span>
              <hr />
              <p className="body review-text">{item.description}</p>
            </div>
          ))}
        </div>
      </StyledHowItWorksPage>

      <FloatWrapper position="bottom" transition="slide-bottom">
        <Button onClick={() => onClick()}>Start My Style Journey</Button>
      </FloatWrapper>
    </>
  );
};

export { HowItWorksComponent };
