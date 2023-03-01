import { UniversalLink } from '@plone/volto/components';
import cx from 'classnames';
import './Hero.less';

const widthClassnameMapping = {
  wide: 'nsw-hero-banner--wide',
  extraWide: 'nsw-hero-banner--extra-wide',
};

export const Hero = ({
  title,
  description,
  imageUrl = null,
  linkTitle = null,
  linkUrl = null,
  linksTitle = '',
  linksList = [],
  width = 'default',
  contentChildren,
  boxChildren,
}) => {
  return (
    // TODO: There's a hidden `nsw-hero-banner--wide` class that makes the text longer, but it causes overflow
    <div
      className={cx('nsw-hero-banner nsw-hero-banner--dark', {
        [widthClassnameMapping[width]]: width !== 'default',
      })}
    >
      <div className="nsw-hero-banner__container">
        <div className="nsw-hero-banner__wrapper">
          <div className="nsw-hero-banner__content">
            {title ? <h1>{title}</h1> : null}
            {description ? <p className="nsw-intro">{description}</p> : null}
            {linkUrl && linkTitle ? (
              <div className="nsw-hero-banner__button">
                <UniversalLink
                  href={linkUrl}
                  className="nsw-button nsw-button--white"
                >
                  {linkTitle}
                </UniversalLink>
              </div>
            ) : null}
            {contentChildren ? (
              <div className="nsw-m-top-md">{contentChildren}</div>
            ) : null}
          </div>
          {linksList && linksList.length > 0 ? (
            <div className="nsw-hero-banner__links">
              <div className="nsw-hero-banner__list">
                {linksTitle ? (
                  <div className="nsw-hero-banner__sub-title">{linksTitle}</div>
                ) : null}
                <ul>
                  {linksList.map((linkItem) => {
                    return (
                      <li key={linkItem.title}>
                        <UniversalLink item={linkItem.link}>
                          {linkItem.title}
                        </UniversalLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : null}
          <div className="nsw-hero-banner__box">
            {imageUrl && (
              <img src={imageUrl} alt="" className="nsw-hero-banner__image" />
            )}
            {boxChildren}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
