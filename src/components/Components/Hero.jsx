import { UniversalLink } from '@plone/volto/components';
import { isValidElement } from 'react'
import cx from 'classnames';

const widthClassnameMapping = {
  wide: 'nsw-hero-banner--wide',
  extraWide: 'nsw-hero-banner--extra-wide',
};

const colourClassnameMapping = {
  '': 'nsw-hero-banner--dark',
  dark: 'nsw-hero-banner--dark',
  light: 'nsw-hero-banner--light',
  white: '',
  offWhite: 'nsw-hero-banner--off-white',
};

export const Hero = ({
  title,
  description,
  imageUrl = null,
  linkTitle = null,
  linkUrl,
  linksTitle = '',
  linksList = [],
  linkListStyle,
  width = 'default',
  colour,
  contentChildren,
  boxChildren,
}) => {
  // Null check as white will give an empty strnig
  const mappedColour =
    colourClassnameMapping[colour] ?? 'nsw-hero-banner--dark';
  const isLightColour = ['light', 'white', 'offWhite'].includes(colour);
  
  console.log("MAPPED", colour, mappedColour)
  console.log("LINK URL", linkUrl)

  // TODO: There's a hidden `nsw-hero-banner--wide` class that makes the text longer, but it causes overflow
  return (
    <div
      className={cx('nsw-hero-banner', {
        [mappedColour]: mappedColour !== null,
        [widthClassnameMapping[width]]: width !== 'default',
      })}
    >
      <div className="nsw-hero-banner__container">
        <div className="nsw-hero-banner__wrapper">
          <div className="nsw-hero-banner__content">
            {title ? isValidElement(title) ? title : <h1>{title}</h1> : null}
            {description ? (
              isValidElement(description) ? (
                description
              ) : (
                <p className="nsw-intro">{description}</p>
              )
            ) : null}
            {linkUrl !== undefined && linkTitle ? (
              isValidElement(linkTitle) ? (
                linkTitle
              ) : (
                <div className="nsw-hero-banner__button">
                  <UniversalLink
                    href={linkUrl}
                      // className=" nsw-button--white"
                    className={cx('nsw-button', {
                      'nsw-button--white': !isLightColour,
                      'nsw-button--dark': isLightColour,
                    })}
                  >
                    {linkTitle}
                  </UniversalLink>
                </div>
              )
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
                <ul className={linkListStyle ? linkListStyle : null}>
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
            {imageUrl ? (
              isValidElement(imageUrl) ? (
                imageUrl
              ) : (
                <img src={imageUrl} alt="" className="nsw-hero-banner__image" />
              )
            ) : null}
            {boxChildren}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
