import cx from 'classnames';
import React from 'react';

// TODO: Allow choosing the heading level of the title.
const Section = ({
  title,
  description,
  children,
  padding,
  isBox,
  colour,
  shouldInvert,
  imageSrc = undefined,
}) => {
  return (
    <section
      className={cx('nsw-section', {
        [`nsw-section--${padding}-padding`]: padding && padding !== 'full',
        'nsw-section--box': isBox,
        [`nsw-section--${colour}`]: colour,
        'nsw-section--invert': shouldInvert,
        'nsw-section--image': imageSrc,
      })}
      style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : null}
    >
      <div className="nsw-container">
        {title ? <h2 className="nsw-section-title">{title}</h2> : null}
        {description ? <p className="nsw-section-text">{description}</p> : null}
        {children}
      </div>
    </section>
  );
};

export { Section };
