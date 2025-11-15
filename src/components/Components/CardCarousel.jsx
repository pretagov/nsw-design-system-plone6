import { Card } from 'nsw-design-system-plone6/components/Components/Card';

import loadable from '@loadable/component';
import { Icon } from '@plone/volto/components';
import { useEffect, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import ChevronLeftSVG from '@material-design-icons/svg/filled/chevron_left.svg';
import ChevronRightSVG from '@material-design-icons/svg/filled/chevron_right.svg';

const messages = defineMessages({
  showPreviousItems: {
    id: 'Show previous items',
    defaultMessage: 'Show previous items',
  },
  showNextItems: {
    id: 'Show next items',
    defaultMessage: 'Show next items',
  },
});

/**
 * @param {Object} props
 * @param {Object.<string, Card> | Array.<Card>} props.cards
 */
export function CardCarousel({ title, description, cards, CardDisplay = Card }) {
  const cardValues = Array.isArray(cards) ? cards : Object.values(cards);
  const intl = useIntl();

  const carouselElement = useRef(null);
  useEffect(() => {
    if (carouselElement.current) {
      loadable(() => import('nsw-design-system/src/components/card-carousel/carousel'))
        .load()
        .then((carouselJs) => {
          new carouselJs.default(carouselElement.current).init();
        });
    }
  }, []);

  return (
    <>
      {/* TODO: 'nsw-carousel--loaded' is added by the JS, we should remove it */}
      <div
        // className="nsw-carousel js-carousel nsw-carousel--loaded"
        className="nsw-carousel js-carousel"
        data-description={description}
        data-drag="on"
        data-loop="on"
        data-navigation="on"
        data-navigation-pagination="off"
        ata-justify-content="off"
        ref={carouselElement}
      >
        <p className="sr-only">Carousel items</p>
        <div className="nsw-carousel__wrapper js-carousel__wrapper">
          <ol className="nsw-carousel__list">
            {/* TODO: Don't use index */}
            {cardValues.map((card, index) => {
              return (
                <li key={index} className="nsw-carousel__item">
                  <CardDisplay {...card} />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="nsw-carousel__header">
          <div className="nsw-carousel__title">
            <h2>{title}</h2>
          </div>
          <nav aria-label="Carousel controls">
            <ul>
              <li>
                <button aria-label={intl.formatMessage(messages.showPreviousItems)} className="nsw-carousel__control nsw-carousel__control--prev js-carousel__control">
                  <Icon name={ChevronLeftSVG} className="nsw-icon" size="28px" ariaHidden={true} />
                </button>
              </li>
              <li>
                <button aria-label={intl.formatMessage(messages.showNextItems)} className="nsw-carousel__control nsw-carousel__control--next js-carousel__control">
                  <Icon name={ChevronRightSVG} className="nsw-icon" size="28px" ariaHidden={true} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
