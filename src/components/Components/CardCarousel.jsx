import { CardView } from 'nsw-design-system-plone6/components/Blocks/Card/View';

import loadable from '@loadable/component';
import { Icon } from '@plone/volto/components';
import { useRef } from 'react';
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

const modeDataAttrbiutesMapping = {
  fixed: {
    'data-loop': 'off',
    'data-navigation': 'on',
  },
  loop: {
    'data-loop': 'on',
    'data-navigation': 'off',
  },
  paginated: {
    'data-loop': 'off',
    'data-navigation-pagination': 'on',
  },
};

/**
 * @param {Object} props
 * @param {Object.<string, Card> | Array.<Card>} props.cards
 * @param {'fixed' | 'loop' | 'paginated'} props.mode
 */
export function CardCarousel({
  title,
  description,
  cards,
  CardDisplay = CardView,
  draggable = true,
  mode = 'fixed',
}) {
  const cardValues = Array.isArray(cards) ? cards : Object.values(cards);
  const intl = useIntl();

  // Can't wrap this in a useEffect as the poor app-level rendering in Volto causes the component to be unmounted while running the effect
  // TODO: Below code is at risk of a memory leak if the app re-renders or we have lots of carousels on one page and needs updating!
  const carouselController = useRef(null);
  const carouselElement = useRef(null);
  if (
    __CLIENT__ &&
    carouselController.current === null &&
    carouselElement.current
  ) {
    // Set it from null to false to ensure we only attempt to try the loadable once
    carouselController.current = false;
    loadable(
      () => import('nsw-design-system/src/components/card-carousel/carousel'),
      { ssr: false },
    )
      .load()
      .then((carouselJs) => {
        if (!carouselController.current && carouselElement.current) {
          if (!document.body.contains(carouselElement.current)) {
            return;
          }

          const carouselInstance = new carouselJs.default(
            carouselElement.current,
          );
          const originalInit = carouselInstance.init.bind(carouselInstance);
          const originalResetCarouselResize = carouselInstance.resetCarouselResize.bind(
            carouselInstance,
          );

          // Add checks to the carousel controller code to ensure we're running against an actually mounted DOM.
          carouselInstance.init = function () {
            if (
              carouselElement.current &&
              document.body.contains(carouselElement.current)
            ) {
              originalInit();
            }
          };
          carouselInstance.resetCarouselResize = function () {
            if (
              carouselElement.current &&
              document.body.contains(carouselElement.current)
            ) {
              originalResetCarouselResize();
            }
          };

          carouselController.current = carouselInstance;
          carouselController.current.init();
        }
      })
      .catch(() => {
        // Reset it back to null so we can re-attempt a loadable later
        carouselController.current = null;
      });
  }

  const modeDataAttrbiutes =
    modeDataAttrbiutesMapping[mode] || modeDataAttrbiutesMapping['fixed'];

  return (
    <>
      <div
        className="nsw-carousel js-carousel"
        data-description={description}
        data-drag={draggable === false ? 'off' : 'on'}
        data-justify-content="off"
        data-overflow-items="off"
        {...modeDataAttrbiutes}
        ref={carouselElement}
      >
        <p className="sr-only">Carousel items</p>
        <div className="nsw-carousel__wrapper js-carousel__wrapper">
          <ol className="nsw-carousel__list">
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
          {title ? (
            <div className="nsw-carousel__title">
              <h2>{title}</h2>
            </div>
          ) : null}
          <nav aria-label="Carousel controls">
            <ul>
              <li>
                <button
                  aria-label={intl.formatMessage(messages.showPreviousItems)}
                  className="nsw-carousel__control nsw-carousel__control--prev js-carousel__control"
                >
                  <Icon
                    name={ChevronLeftSVG}
                    className="nsw-icon"
                    size="28px"
                    ariaHidden={true}
                  />
                </button>
              </li>
              <li>
                <button
                  aria-label={intl.formatMessage(messages.showNextItems)}
                  className="nsw-carousel__control nsw-carousel__control--next js-carousel__control"
                >
                  <Icon
                    name={ChevronRightSVG}
                    className="nsw-icon"
                    size="28px"
                    ariaHidden={true}
                  />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
