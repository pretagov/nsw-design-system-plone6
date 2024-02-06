import cx from 'classnames';
import PropTypes from 'prop-types';

const validSizes = ['lg', 'md', 'sm'];

export function Loader({ size, fillWidth = false }) {
  if (!validSizes.includes(size)) {
    // eslint-disable-next-line no-console
    console.warn('Invalid loader size', size);
  }

  return (
    <div
      className={cx('nsw-loader', {
        'nsw-width-100': fillWidth,
      })}
    >
      <span
        aria-hidden="true"
        className={cx('nsw-loader__circle', {
          [`nsw-loader__circle--${size}}`]: !!size,
        })}
      ></span>
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(validSizes),
  fillWidth: PropTypes.bool,
};
