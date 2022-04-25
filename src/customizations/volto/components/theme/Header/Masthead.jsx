import cx from 'classnames';

const Masthead = ({ lightMode }) => {
  return (
    <div className={cx('nsw-masthead', { 'nsw-masthead--light': lightMode })}>
      <div className="nsw-container">A NSW Government website</div>
    </div>
  );
};

export { Masthead };
export default Masthead;
