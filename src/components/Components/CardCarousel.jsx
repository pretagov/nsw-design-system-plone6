import { Icon } from '@plone/volto/components';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';
import { defineMessages, useIntl } from 'react-intl';

import KeyboardArrowLeftSVG from '@material-design-icons/svg/filled/keyboard_arrow_left.svg';
import ChevronLeftSVG from '@material-design-icons/svg/filled/keyboard_arrow_left.svg';
import KeyboardArrowRightSVG from '@material-design-icons/svg/filled/keyboard_arrow_right.svg';

const messages = defineMessages({
  showPreviousItems: {
    id: 'Show previous items',
    defaultMessage: 'Show previous items',
  },
});

/**
 * @param {Object} props
 * @param {Object.<string, Card> | Array.<Card>} props.cards
 */
export function CardCarousel({ title, cards }) {
  const cardValues = Array.isArray(cards) ? cards : Object.values(cards);
  const intl = useIntl();

  return (
    <>
      {/* TODO: 'nsw-carousel--loaded' is added by the JS, we should remove it */}
      <div className="nsw-carousel js-carousel nsw-carousel--loaded" data-description="Highlighted latest news" data-drag="on">
        <p className="sr-only">Carousel items</p>
        <div className="nsw-carousel__wrapper js-carousel__wrapper">
          <ol className="nsw-carousel__list">
            {/* TODO: Don't use index */}
            {cardValues.map((card, index) => {
              return (
                <li key={index} className="nsw-carousel__item">
                  <Card {...card} />
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
                  {/* TODO: Do we actuall need the SVG do be descriptive? */}
                  <Icon name={ChevronLeftSVG} className="nsw-icon" size="24px" ariaHidden={true} />

                  <svg className="nsw-icon" viewBox="0 0 20 20">
                    <title>Show previous items</title>
                    <polyline points="13 2 5 10 13 18" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="square" stroke-width="2" />
                  </svg>
                </button>
              </li>
              <li>
                <button aria-label="Show next items" className="nsw-carousel__control nsw-carousel__control--next js-carousel__control">
                  <svg className="nsw-icon" viewBox="0 0 20 20">
                    <title>Show next items</title>
                    <polyline points="7 2 15 10 7 18" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="square" stroke-width="2" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
