import React from 'react';

export const Hero = ({
  title,
  description,
  imageUrl = null,
  linkTitle = null,
  linkUrl = null,
  linksList = [],
  contentChildren,
  boxChildren,
}) => {
  return (
    // TODO: There's a hidden `nsw-hero-banner--wide` class that makes the text longer, but it causes overflow
    <div className="nsw-hero-banner nsw-hero-banner--dark">
      <div className="nsw-hero-banner__container">
        <div className="nsw-hero-banner__wrapper">
          <div className="nsw-hero-banner__content">
            {title ? <h1>{title}</h1> : null}
            {description ? <p className="nsw-intro">{description}</p> : null}
            {linkUrl && linkTitle ? (
              <div className="nsw-hero-banner__button">
                <a href={linkUrl} className="nsw-button nsw-button--white">
                  {linkTitle}
                </a>
              </div>
            ) : null}
            {contentChildren ? (
              <div className="nsw-m-top-md">{contentChildren}</div>
            ) : null}
          </div>
          {linksList && linksList.length > 0 ? (
            <div class="nsw-hero-banner__links">
              <div class="nsw-hero-banner__list">
                <div class="nsw-hero-banner__sub-title">
                  Key coronavirus links
                </div>
                <ul>
                  <li>
                    <a href="#">COVIDSafe App</a>
                  </li>
                  <li>
                    <a href="#">Current COVID-19 case locations</a>
                  </li>
                  <li>
                    <a href="#">Travel to and from NSW</a>
                  </li>
                  <li>
                    <a href="#">Health and wellbeing</a>
                  </li>
                  <li>
                    <a href="#">Business and work</a>
                  </li>
                  <li>
                    <a href="#">COVID-19 testing centres</a>
                  </li>
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
