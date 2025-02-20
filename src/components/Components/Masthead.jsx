import cx from 'classnames';

export function Masthead({ lightMode }) {
  return (
    <div className={cx('nsw-masthead', { 'nsw-masthead--light': lightMode })}>
      <div className="nsw-container">A NSW Government website</div>
    </div>
  );
}
